import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { galleryImages } from "../lib/gallery-images.js";
test("all gallery renders use supplied local images and are valid WebP", async () => {
  assert(galleryImages.length >= 20);
  for (const image of galleryImages) {
    assert(image.src.startsWith("/images/"));
    const bytes = await readFile("public" + decodeURIComponent(image.src));
    assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
    assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
  }
});
test("Next app uses reusable React components and all referenced assets exist", async () => {
  const pkg = JSON.parse(await readFile("package.json", "utf8"));
  assert(pkg.dependencies.next);
  assert.equal(pkg.scripts.build, "next build");
  const components = await readdir("components");
  for (const file of components) {
    const source = await readFile("components/" + file, "utf8");
    assert(!source.includes("dangerouslySetInnerHTML"));
    for (const [, asset] of source.matchAll(
      /(?:src|href)="(\/(?:assets|images)\/[^"?]+)"/g,
    ))
      assert(
        (await stat("public" + decodeURIComponent(asset))).size > 0,
        asset,
      );
    for (const [, classes] of source.matchAll(/className="([^"]+)"/g))
      assert(
        classes.split(/\s+/).every((c) => c.startsWith("bsq-")),
        classes,
      );
  }
});
test("six destination distances match official Berkeley Square location", async () => {
  const files = await readdir("components");
  const sources = await Promise.all(
    files.map((f) => readFile("components/" + f, "utf8")),
  );
  const location = sources.find((s) => s.includes('id="location"'));
  const expected = [
    ["Mall of the Emirates", 15],
    ["Palm Jumeirah", 16],
    ["Dubai Marina", 18],
    ["Downtown Dubai", 18],
    ["Burj Khalifa and Dubai Mall", 25],
    ["Dubai International Airport", 30],
  ];
  const cards = [
    ...location.matchAll(/<a\s+className="bsq-destination"[\s\S]*?<\/a>/g),
  ];
  assert.equal(cards.length, 6);
  for (const [i, [name, time]] of expected.entries()) {
    assert(cards[i][0].includes(`<h3>${name}</h3>`));
    assert(
      new RegExp(`bsq-destination-time"\\s*>\\s*${time}\\s*<small>`).test(
        cards[i][0],
      ),
    );
  }
});
