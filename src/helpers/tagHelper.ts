import isStringEmpty from '@helpers/isStringEmpty';

export function addTag(tags: Set<string>, new_tag: string): Set<string> {
  new_tag = new_tag.toLowerCase().trim();
  if (isStringEmpty(new_tag)) return tags;
  const newTags = new Set([...tags]);
  newTags.add(new_tag);
  return newTags;
}

export function addTagList(tags: Set<string>, new_tags: string): Set<string> {
  const tagsList = new_tags
    .split('\n')
    .map((tag) => tag.toLowerCase().trim())
    .filter((tag) => !isStringEmpty(tag));

  const newTags = new Set([...tags]);
  tagsList.forEach((tag) => newTags.add(tag));
  return newTags;
}

export function deleteTag(tags: Set<string>, deleting_tag: string): Set<string> {
  const newTags = new Set([...tags]);
  newTags.delete(deleting_tag);
  return newTags;
}

export function changeTag(tags: Set<string>, tag: string, new_name: string): Set<string> {
  new_name = new_name.toLowerCase().trim();
  if (isStringEmpty(new_name) || tags.has(new_name)) return tags;
  const newTags = new Set([...tags]);
  newTags.delete(tag);
  newTags.add(new_name);
  return newTags;
}

export function removeAllTags(): Set<string> {
  return new Set();
}
