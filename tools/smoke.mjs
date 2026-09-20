import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import * as game from './legacy-game.mjs';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const scene = JSON.parse(readFileSync(join(root, 'assets/scenes/Main.scene'), 'utf8'));
const scriptMeta = JSON.parse(readFileSync(join(root, 'assets/scripts/MistboundApp.ts.meta'), 'utf8'));
const sceneMeta = JSON.parse(readFileSync(join(root, 'assets/scenes/Main.scene.meta'), 'utf8'));
const builder = JSON.parse(readFileSync(join(root, 'settings/v2/packages/builder.json'), 'utf8'));

assert.equal(scene[0].__type__, 'cc.SceneAsset');
assert.equal(scene[1]._id, sceneMeta.uuid);
assert.equal(builder.startScene, sceneMeta.uuid);
assert.ok(scene.some(item => item.__type__ === 'cc.Canvas'));
assert.ok(scene.some(item => item.__type__ === 'cc.Camera'));
assert.equal(scriptMeta.uuid, '6ad20b48-58c1-4c5d-b63e-4c127eb82399');
assert.ok(scene.some(item => item.__type__ === '6ad20tIWMFMXbY+TBJ+uCOZ'));
assert.ok(existsSync(join(root, 'assets/resources/art/camper.webp')));

let state = game.newRun(20260917);
assert.equal(state.phase, 'hub');
state = game.transition(state, { type: 'depart', stage: 0 });
assert.equal(state.phase, 'mainStory');
state = game.transition(state, { type: 'mainStoryContinue' });
assert.equal(state.phase, 'map');
const first = game.chapterMap(0, state.mapSeed).find(node => node.row === 0);
state = game.transition(state, { type: 'node', id: first.id });
assert.equal(state.phase, 'combat');
assert.ok(state.hand.length > 0);
const playable = state.hand.findIndex(key => game.card(key).cost <= state.energy);
if (playable >= 0) state = game.transition(state, { type: 'play', index: playable });
assert.ok(['combat', 'reward'].includes(state.phase));
assert.deepEqual(game.restore(game.serialize(state)), state);
console.log('Scene references and first gameplay loop passed.');

