import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

import Sound from './models/Sound';

const adapter = new FileSync('db.json');
const connection = lowdb(adapter);
connection.defaults({ sounds: [], ignoreList: [], entrances: {} }).write();

export const findByName = (name: string) => all().find({ name });

export const exists = (name: string) => !!findByName(name).value();

export const add = (sound: string) => {
  all().push(new Sound(sound)).write();
};

export const rename = (oldName: string, newName: string) => {
  findByName(oldName).assign({ name: newName }).write();
};

export const remove = (name: string) => {
  all().remove({ name }).write();
};

export const incrementCount = (sound: string) => {
  if (!exists(sound)) add(sound);

  const newValue = (findByName(sound).value()! as Sound).count + 1;
  findByName(sound).set('count', newValue).write();
};

export const withTag = (tag: string) =>
  all().filter((sound: Sound) => sound.tags.includes(tag))
    .map((sound: Sound) => sound.name)
    .value();

export const addTags = (sound: string, tags: string[]) => {
  if (!exists(sound)) add(sound);
  tags.forEach(tag => addSingleTag(sound, tag));
};

export const listTags = (sound: string) => {
  if (!exists(sound)) return [];

  return (findByName(sound).value()! as Sound).tags.sort();
};

export const clearTags = (sound: string) => {
  if (!exists(sound)) return;

  findByName(sound).assign({ tags: [] }).write();
};

export const mostPlayed = (limit = 15) =>
  all().sortBy('count')
    .reverse()
    .take(limit)
    .value();

const all = () => connection.get('sounds');

const addSingleTag = (sound: string, tag: string) => {
  const tags = (findByName(sound).value()! as Sound).tags;
  if (tags.includes(tag)) return;

  tags.push(tag);
  findByName(sound).assign({ tags }).write();
};