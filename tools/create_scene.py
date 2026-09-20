"""Generate the small Cocos Creator 3.8 bootstrap scene and stable meta IDs."""

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCENE_ID = "89c30112-ae05-4620-8667-149c98a8b764"
SCRIPT_ID = "6ad20b48-58c1-4c5d-b63e-4c127eb82399"


def compressed_uuid(value):
    digits = value.replace("-", "")
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    encoded = "".join(
        alphabet[int(digits[i : i + 3], 16) >> 6]
        + alphabet[int(digits[i : i + 3], 16) & 63]
        for i in range(5, 32, 3)
    )
    return digits[:5] + encoded


def vec3(x=0, y=0, z=0):
    return {"__type__": "cc.Vec3", "x": x, "y": y, "z": z}


def quat():
    return {"__type__": "cc.Quat", "x": 0, "y": 0, "z": 0, "w": 1}


def node(name, parent, children, components, layer, position=None):
    return {
        "__type__": "cc.Node", "_name": name, "_objFlags": 0,
        "__editorExtras__": {}, "_parent": {"__id__": parent},
        "_children": [{"__id__": item} for item in children], "_active": True,
        "_components": [{"__id__": item} for item in components], "_prefab": None,
        "_lpos": position or vec3(), "_lrot": quat(), "_lscale": vec3(1, 1, 1),
        "_layer": layer, "_euler": vec3(), "_id": "",
    }


scene = [
    {"__type__": "cc.SceneAsset", "_name": "Main", "_objFlags": 0,
     "__editorExtras__": {}, "_native": "", "scene": {"__id__": 1}},
    {"__type__": "cc.Scene", "_name": "Main", "_objFlags": 0,
     "__editorExtras__": {}, "_parent": None, "_children": [{"__id__": 2}],
     "_active": True, "_components": [], "_prefab": None,
     "_lpos": vec3(), "_lrot": quat(), "_lscale": vec3(1, 1, 1),
     "_layer": 1073741824, "_euler": vec3(), "autoReleaseAssets": False,
     "_id": SCENE_ID},
    node("Canvas", 1, [3], [5, 6, 7], 33554432),
    node("Camera", 2, [], [4], 33554432, vec3(0, 0, 1000)),
    {"__type__": "cc.Camera", "_name": "", "_objFlags": 0,
     "node": {"__id__": 3}, "_enabled": True, "_projection": 0,
     "_priority": 1073741824, "_fov": 45, "_fovAxis": 0, "_orthoHeight": 640,
     "_near": 1, "_far": 2000, "_clearFlags": 6,
     "_color": {"__type__": "cc.Color", "r": 20, "g": 24, "b": 37, "a": 255},
     "_depth": 1, "_stencil": 0,
     "_rect": {"__type__": "cc.Rect", "x": 0, "y": 0, "width": 1, "height": 1},
     "_visibility": 41943040, "_id": ""},
    {"__type__": "cc.UITransform", "_name": "", "_objFlags": 0,
     "node": {"__id__": 2}, "_enabled": True,
     "_contentSize": {"__type__": "cc.Size", "width": 720, "height": 1280},
     "_anchorPoint": {"__type__": "cc.Vec2", "x": 0.5, "y": 0.5}, "_id": ""},
    {"__type__": "cc.Canvas", "_name": "", "_objFlags": 0,
     "node": {"__id__": 2}, "_enabled": True,
     "_cameraComponent": {"__id__": 4}, "_alignCanvasWithScreen": True, "_id": ""},
    {"__type__": compressed_uuid(SCRIPT_ID), "_name": "", "_objFlags": 0,
     "node": {"__id__": 2}, "_enabled": True, "_id": ""},
]


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


write_json(ROOT / "assets/scenes/Main.scene", scene)
write_json(ROOT / "assets/scenes/Main.scene.meta", {
    "ver": "1.1.50", "importer": "scene", "imported": True, "uuid": SCENE_ID,
    "files": [".json"], "subMetas": {}, "userData": {},
})
write_json(ROOT / "assets/scripts/MistboundApp.ts.meta", {
    "ver": "4.0.24", "importer": "typescript", "imported": True,
    "uuid": SCRIPT_ID, "files": [], "subMetas": {}, "userData": {},
})
write_json(ROOT / "settings/v2/packages/builder.json", {
    "__version__": "1.3.9", "scenes": [
        {"url": "db://assets/scenes/Main.scene", "uuid": SCENE_ID}
    ], "startScene": SCENE_ID,
})
print(f"Created Main.scene with script class ID {compressed_uuid(SCRIPT_ID)}")
