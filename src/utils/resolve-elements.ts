import isVisible from 'is-visible';

export interface FieldSpec<Type extends HTMLElement = HTMLElement> {
  root?: Document | HTMLElement;
  prepare?: (root: Document | HTMLElement) => void;
  find: {
    selectors: readonly string[];
    sort?: Array<{
      test: RegExp;
      weight: number;
    }>;
  };
}

export type ElementTypeFromFieldSpec<Spec extends FieldSpec<any>> = Spec extends FieldSpec<infer Type> ? Type : never;

const VISIBILE_SCORE_INCREMENT = 8;

/**
 * Finds and sorts elements based on a `spec` object.
 *
 * @param spec The `FieldSpec` object which describes how to resolve elements.
 * @param root The root element to start querying within.
 * @returns An array of elements, sorted according to the sped'd heuristic.
 */
export function resolveElements<Spec extends FieldSpec<any>>(
  spec: Spec,
  root: Document | HTMLElement = document,
): ElementTypeFromFieldSpec<Spec>[] {
  const { prepare, find } = spec;
  const { selectors, sort: sortTests = [] } = find;

  prepare?.apply(spec, [root]);

  const query = selectors.join(', ');
  const elements = Array.prototype.slice.call(root.querySelectorAll(query)) as HTMLElement[];

  const getScore = (el: HTMLElement) => {
    const html = el.outerHTML;
    let score = sortTests.reduce((current, check) => {
      const value = check.test.test(html) ? check.weight : 0;
      return current + value;
    }, 0);
    if (isVisible(el)) {
      score += VISIBILE_SCORE_INCREMENT;
    }
    el.setAttribute('data-uno-score', String(score));
    return score;
  };

  return elements.sort((elA, elB) => {
    const scoreA = getScore(elA);
    const scoreB = getScore(elB);
    if (scoreA > scoreB) {
      return -1;
    }
    if (scoreB > scoreA) {
      return 1;
    }
    return 0;
  }) as ElementTypeFromFieldSpec<Spec>[];
}
