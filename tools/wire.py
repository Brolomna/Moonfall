#!/usr/bin/env python3
"""Hook the generated design views up to the room server.

The design files keep mock data so the canvas prototypes work on their own. This script
swaps the mock bits for live room data coming in through props. Each edit is tagged
`// NET:` in the output so you can see exactly what differs from the design.

Usage: python3 tools/wire.py src/views/HostView.tsx src/views/PlayerView.tsx
"""
import sys


def rep(s, old, new, label):
    if s.count(old) != 1:
        raise SystemExit(f'wire.py: could not find a unique match for "{label}" — the design changed; update tools/wire.py')
    return s.replace(old, new)


FRAME_H = "overflow: 'clip', height: (this.props.frameH ? this.props.frameH + 'px' : '844px') /* NET: fills the phone screen */"


def wire_host(s):
    s = rep(s, "export class HostView extends React.Component<any, any> {", """export class HostView extends React.Component<any, any> {
  // NET: fields the host owns that are mirrored to the server (so players see them and a refresh keeps the game)
  static SHARED = ['screen', 'counts', 'picked', 'custom', 'edits', 'rules', 'roomLang', 'phase', 'round', 'status', 'override', 'dismissed', 'checks', 'tough', 'dgDone'];

  constructor(props) {
    super(props);
    this.state = { ...(props.sharedInit || {}) };
  }

  setState(patch, cb) {
    if (patch && typeof patch === 'object') {
      const shared = {};
      for (const k of HostView.SHARED) if (k in patch) shared[k] = patch[k] === undefined ? null : patch[k];
      if (Object.keys(shared).length && this.props.onPatch) this.props.onPatch(shared);
    }
    return super.setState(patch, cb);
  }
""", 'class header')
    # live players instead of the mock list
    start = s.index("    const palette = { Mira:")
    end = s.index("\n", s.index("    const players = names.map(nm =>")) + 1
    s = s[:start] + """    // NET: players come from the room server
    const netPlayers = (this.props.net && this.props.net.players) || [];
    const palette = {}; netPlayers.forEach(p => { palette[p.name] = p.color; });
    const names = netPlayers.map(p => p.name);
    const n = names.length;
    const players = netPlayers.map(p => ({ name: p.name, initial: (p.name[0] || '?').toUpperCase(), color: p.color, connected: p.connected, kick: () => this.props.onKick && this.props.onKick(p.name) }));
""" + s[end:]
    s = rep(s, "baseRole[nm] = shuffled[i] || byKey.villager;",
            "baseRole[nm] = byKey[((this.props.net && this.props.net.assign) || {})[nm]] || shuffled[i] || byKey.villager; /* NET: server deals the cards */",
            'baseRole')
    s = rep(s, "      deal: () => this.setState({", "      deal: () => (this.props.onDeal && this.props.onDeal(deck.map(r => r.key)), this.setState({ /* NET */", 'deal')
    i = s.index("      deal: () => (this.props.onDeal")
    j = s.index("}),\n", i)
    s = s[:i] + s[i:j] + "})),\n" + s[j + 4:]
    s = rep(s, "      endGame: () => this.setState({", "      endGame: () => (this.props.onEnd && this.props.onEnd(), this.setState({ /* NET */", 'endGame')
    # close the extra paren opened for endGame
    i = s.index("      endGame: () => (this.props.onEnd")
    j = s.index("})\n", i)
    s = s[:j] + "}))\n" + s[j + 3:]
    s = rep(s, "      roomLangs: [", """      qrSrc: (this.props.info && this.props.info.qr) || '', joinHost: (this.props.info && this.props.info.host) || '…', // NET
      roomLangs: [""", 'roomLangs')
    s = s.replace("width: '390px', height: '844px', overflow: 'hidden', fontFamily: \"'Manrope', sans-serif\"",
                  "width: '390px', " + FRAME_H + ", fontFamily: \"'Manrope', sans-serif\"", 1)
    return s


def wire_player(s):
    s = rep(s, "export class PlayerView extends React.Component<any, any> {", """export class PlayerView extends React.Component<any, any> {
  // NET: turn the card face-down again whenever the host marks this player out / in
  componentDidUpdate(prev) {
    if (prev.fate !== this.props.fate || prev.role !== this.props.role) this.setState({ revealed: false });
  }
""", 'class header')
    s = rep(s, "    const all = this.roles();", """    const all = this.roles();
    // NET: custom roles and host edits arrive from the server
    const defs = this.props.roleDefs || {};
    Object.keys(defs).forEach(k => { all[k] = { ...(all[k] || {}), ...defs[k] }; });""", 'roles')
    s = rep(s, "      const r = all[k]; const t = RT[k];", "      const r = all[k]; const t = defs[k] && defs[k].edited ? null : RT[k]; // NET: host-written text wins", 'loc')
    s = rep(s, "    const screen = s.screen || this.props.screen || 'card';", "    const screen = this.props.screen || 'join'; // NET: the server decides the screen", 'screen')
    s = rep(s, "    const name = s.name !== undefined ? s.name : 'Mira';", "    const name = s.name !== undefined ? s.name : (this.props.name || ''); // NET", 'name')
    s = rep(s, "    const displayName = name.trim() || '…';", "    const displayName = (this.props.name || name).trim() || '…'; // NET", 'displayName')
    i = s.index("    const deck = [['werewolf', 2],")
    j = s.index("\n", i)
    s = s[:i] + "    const deck = (this.props.deck || []).filter(d => all[d[0]]); // NET: the roles the host dealt" + s[j:]
    s = rep(s, "      waitingHost: fmt(T.waitingHost, { n: 10 }),", "      waitingHost: fmt(T.waitingHost, { n: this.props.playerCount || 1 }), // NET", 'waiting')
    s = rep(s, "      join: () => this.setState({ screen: 'waiting' }),", "      join: () => this.props.onJoin && this.props.onJoin(name.trim()), // NET", 'join')
    s = rep(s, "      flip: () => this.setState({ revealed: !revealed })", """      flip: () => this.setState({ revealed: !revealed }),
      demo: !!this.props.demo, // NET: prototype-only buttons stay hidden in the real app
      showRoleList: this.props.showRoles !== false && deck.length > 0""", 'flip')
    s = s.replace("width: '390px', height: '844px', overflow: 'hidden', fontFamily: v.fB",
                  "width: '390px', " + FRAME_H + ", fontFamily: v.fB", 1)
    return s


if __name__ == '__main__':
    host, player = sys.argv[1], sys.argv[2]
    h, pl = wire_host(open(host).read()), wire_player(open(player).read())
    open(host, 'w').write(h)
    open(player, 'w').write(pl)
    print('wired', host, player)
