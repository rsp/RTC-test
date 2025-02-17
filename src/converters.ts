export type Mapping = Map<string, string>;

const MAPPINGS_RECORD_SEPARATOR = ';';
const MAPPINGS_FIELD_SEPARATOR = ':';

export function parseMappings(input: string): Mapping {
  const mapping: Mapping = new Map();
  for (const record of input.split(MAPPINGS_RECORD_SEPARATOR)) {
    const [id, value] = record.split(MAPPINGS_FIELD_SEPARATOR);
    if (!id || !value) {
      throw new Error(`Error parsing mapping for record: "${record}"`);
    }
    mapping.set(id, value);
  }
  return mapping;
}
