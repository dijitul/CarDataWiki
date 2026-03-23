export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function makeSlug(name: string): string {
  return slugify(name)
}

export function modelSlug(makeName: string, modelName: string): string {
  return slugify(`${makeName}-${modelName}`)
}

export function variantSlug(makeName: string, modelName: string, variantName: string): string {
  return slugify(`${makeName}-${modelName}-${variantName}`)
}
