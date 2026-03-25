import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import type { Node, Parent } from 'mdast';
import type { Extension } from 'mdast-util-from-markdown';
import type { StyleMap } from './types';
import { defaultStyles } from './styles';

// Remove text-only style props for View-safe styles
type TextOnlyProps = Omit<TextStyle, keyof ViewStyle>;

function removeTextStyleProps<T extends ViewStyle | TextStyle>(style: T): ViewStyle {
  const textOnlyKeys: (keyof TextOnlyProps)[] = [
    'color',
    'fontFamily',
    'fontSize',
    'fontStyle',
    'fontWeight',
    'letterSpacing',
    'lineHeight',
    'textAlign',
    'textDecorationLine',
    'textDecorationStyle',
    'textDecorationColor',
    'textShadowColor',
    'textShadowOffset',
    'textShadowRadius',
    'textTransform',
    'includeFontPadding',
    'textAlignVertical',
    'fontVariant',
    'writingDirection',
  ];
  const result = { ...style };
  textOnlyKeys.forEach((key) => {
    delete (result as any)[key];
  });
  return result as ViewStyle;
}

export function getMergedStyles(
  styles: StyleMap | null = null,
  merge = false
): StyleMap {
  const output: Record<string, any> = {};

  const allKeys = new Set([
    ...Object.keys(defaultStyles),
    ...(styles ? Object.keys(styles) : []),
  ]);

  for (const key of allKeys) {
    const base = StyleSheet.flatten(defaultStyles[key] as any) ?? {};
    const custom = StyleSheet.flatten(styles?.[key] as any) ?? {};

    const final = merge
      ? { ...base, ...custom }
      : styles?.[key]
        ? custom
        : base;

    output[key] = final;
    output[`_VIEW_SAFE_${key}`] = removeTextStyleProps(final as any);
  }

  return StyleSheet.create(output);
}

// Generate unique keys for nodes based on position
function getKey(node: Node): string {
  const { start, end } = node.position ?? {};
  if (start && end) {
    return `${node.type}-${start.line}:${start.column}-${end.line}:${end.column}`;
  }
  return `${node.type}-${Math.random().toString(16).slice(2, 8)}`;
}

function addKeysRecursively(node: Node): void {
  if (node.position) {
    node.key = getKey(node);
  }
  if ('children' in node && Array.isArray((node as Parent).children)) {
    for (const child of (node as Parent).children) {
      addKeysRecursively(child);
    }
  }
}

export function getKeyFromMarkdown(): Extension {
  return {
    transforms: [
      (tree) => {
        addKeysRecursively(tree);
      },
    ],
  };
}

// Resolve link and image references
import type { Definition, Root, RootContent } from 'mdast';

function normalizeIdentifier(id: string): string {
  return id.trim().toLowerCase();
}

const transform = (
  node: RootContent | Root,
  definitions: Map<string, Definition>
): void => {
  if (node.type === 'linkReference' || node.type === 'imageReference') {
    const def = definitions.get(normalizeIdentifier(node.identifier));
    if (!def) return;

    if (node.type === 'linkReference') {
      const linkNode: any = node;
      linkNode.type = 'link';
      linkNode.url = def.url;
      linkNode.title = def.title ?? null;
    }

    if (node.type === 'imageReference') {
      const imageNode: any = node;
      imageNode.type = 'image';
      imageNode.url = def.url;
      imageNode.title = def.title ?? null;
    }
  }

  if ('children' in node && Array.isArray(node.children)) {
    for (const child of node.children) {
      transform(child, definitions);
    }
  }
};

export function resolveReference(): Extension {
  return {
    transforms: [
      (tree) => {
        const definitions = new Map<string, Definition>();
        const definitionIndices: number[] = [];

        for (const node of tree.children) {
          if (node.type === 'definition') {
            definitions.set(normalizeIdentifier(node.identifier), node);
            definitionIndices.push(tree.children.indexOf(node));
          }
        }

        if (definitions.size === 0) return;

        transform(tree, definitions);

        for (const index of definitionIndices.reverse()) {
          tree.children.splice(index, 1);
        }
      },
    ],
  };
}
