import { Picture } from './picture';
import { Tag } from './tag';
// import readline = require('readline');
// import readlineSync = require('readline-sync');

// let lines: string[] = require('fs').readFileSync('a_example.txt', 'utf-8')
// let lines: string[] = require('fs').readFileSync('b_lovely_landscapes.txt', 'utf-8')
let lines: string[] = require('fs').readFileSync('c_memorable_moments.txt', 'utf-8')
    .split('\n')

const vBuckets: Picture[] = [];
const hBuckets: Picture[] = [];
const slideshow: Picture[] = [];
const vBucketTags: Tag[] = [];
const hBucketTags: Tag[] = [];
let affinitiesBucket: Tag[] = [];

lines.shift();
lines.pop();

lines.forEach((line, index) => {
  const myLine = line.split(' ');

  if (myLine[0] === 'H') {
    hBuckets.push(new Picture({
      id: index,
      type: 'H',
      nTag: myLine[1],
      tags: myLine.slice(2, myLine.length)
    }));
  } else {
    vBuckets.push(new Picture({
      id: index,
      type: 'V',
      nTag: myLine[1],
      tags: myLine.slice(2, myLine.length)
    }));
  }
});

// vBuckets.forEach(element => {
//   console.log(element);
// });

console.log('----');

// hBuckets.forEach(element => {
//   console.log(element);
// });

// Fill del bucket delle picture verticali
for (const vBucket of vBuckets) {
  for (const tag of vBucket.tags) {
    const vBucketTag = vBucketTags.find(vBucketTag => vBucketTag.tag === tag);
    if (vBucketTag) {
      vBucketTag.slides.push(vBucket);
    } else {
      vBucketTags.push(new Tag({
        tag: tag,
        slides: [vBucket],
      }))
    }
  }
}

console.log('------ vBucketTags');
vBucketTags.forEach(element => {
  console.log(element.tag);
  console.log(element.nOccurency);
  console.log(element.slides);
});

console.log('------ check horizontal pairs');

// Calcola picture orizzontali
while (checkPair(vBucketTags)) {
  vBucketTags.sort((a, b) => b.nOccurency - a.nOccurency);

  let maxTags = vBucketTags[0];
  // console.log('maxTags', maxTags);

  maxTags.slides.sort((a, b) => b.nTag - a.nTag);

  let slide1 = maxTags.slides.shift();
  let slide2 = maxTags.slides.shift();
  // console.log('slide1', slide1);
  // console.log('slide2', slide2);

  let tags = [ ...slide1.tags, ...slide2.tags ].filter(onlyUnique);

  let newPicture = new Picture({
    id: `${slide1.id}-${slide2.id}`,
    type: 'VV',
    nTag: tags.length,
    tags: tags
  });
  // console.log('newPicture', newPicture);

  hBuckets.push(newPicture);
}

console.log('------- hBuckets');

hBuckets.forEach(element => {
  console.log('id:', element.id);
  console.log('type:', element.type);
  console.log('nTag:', element.nTag);
  console.log('tags:', element.tags);
  console.log();
});

// Push h tags
for (const hBucket of hBuckets) {
  for (const tag of hBucket.tags) {
    const hBucketTag = hBucketTags.find(hBucketTag => hBucketTag.tag.includes(tag));
    if (hBucketTag) {
      hBucketTag.slides.push(hBucket);
    } else {
      hBucketTags.push(new Tag({
        tag: tag,
        slides: [hBucket],
      }))
    }
  }
}

affinitiesBucket = getAffinityTags();
while () {
  hBucketTags.sort((a, b) => b.nOccurency - a.nOccurency);

  let maxTags = hBucketTags[0];
  // console.log('maxTags', maxTags);

  maxTags.slides.sort((a, b) => b.nTag - a.nTag);

  let slide = maxTags.slides.pop();
  // console.log('slide1', slide1);

  let newPicture = new Picture({
    id: slide.id,
    type: 'H',
    nTag: slide.nTag,
    tags: slide.tags.slice()
  });
  // console.log('newPicture', newPicture);

  slideshow.push(newPicture);
}

function getAffinityTags(picture?: Picture) {
  if (picture) {
    return hBucketTags.filter(hBucketTag => hBucketTag.slides.find(p => p.id === picture.id));
  } else {
    return hBucketTags;
  }
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function checkPair(tags: Tag[]): boolean {
  return tags.filter(t => t.slides.length >= 2).length > 0;
}