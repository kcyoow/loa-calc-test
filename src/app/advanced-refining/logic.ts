import { AdvancedRefineTable } from './data';

const FREE_RATE = (1 / 6) * 0.35;
const BONUS_RATE = 0.16106;
const TOTAL_EXP = 1000;

export interface AdvancedRefineReport {
  normalBreathNames: string[];
  bonusBreathNames: string[];
  normalPaperNames: string[];
  bonusPaperNames: string[];
  expectedTryCount: number;
  expectedPrice: number;
  expectedMaterials: { name: string; amount: number }[];
}

// success rates per breath - T3
const successTableMax3 = {
  0: [0.8, 0.15, 0.05],
  1: [0.7, 0.2, 0.1],
  2: [0.6, 0.25, 0.15],
  3: [0.5, 0.3, 0.2],
  // 4: [0.3, 0.45, 0.25],
  // 5: [0, 0.6, 0.4],
};

// success rates per breath - T4
const successTableMax1 = {
  0: [0.8, 0.15, 0.05],
  1: [0.5, 0.3, 0.2],
  // 2: [0.3, 0.45, 0.25],
  // 3: [0, 0.6, 0.4],
};

const successTablePaper = {
  0: [0, 0, 0],
  1: [-0.5, 0.3, 0.2]
}

const bonusTable = {
  갈라투르: 0.15,
  겔라르: 0.35,
  쿠훔바르: 0.15,
  테메르: 0.35,
};

function getAverageNormalExp(count: {breath: number, paper: number}, maxCount: {breath: number, paper: number}, isT3: boolean) {
    let [성공, 대성공, 대성공2] =
      isT3
        ? successTableMax3[count.breath as keyof typeof successTableMax3]
        : successTableMax1[count.breath as keyof typeof successTableMax1];
    성공 += successTablePaper[count.paper as keyof typeof successTablePaper][0];
    대성공 += successTablePaper[count.paper as keyof typeof successTablePaper][1];
    대성공2 += successTablePaper[count.paper as keyof typeof successTablePaper][2];

  return 성공 * 10 + 대성공 * 20 + 대성공2 * 40;
}

function getAverageBonusExp(count: {breath: number, paper: number}, maxCount: {breath: number, paper: number}, isT3: boolean) {
  const base = getAverageNormalExp({breath: count.breath, paper: count.paper}, {breath: maxCount.breath, paper: maxCount.paper}, isT3);

  const 갈라투르 = base * 5;
  const 겔라르 = base * 3;
  const 쿠훔바르 = base + 30;
  const 테메르 = base + 10;

  return (
    갈라투르 * bonusTable.갈라투르 +
    겔라르 * bonusTable.겔라르 +
    쿠훔바르 * bonusTable.쿠훔바르 +
    테메르 * bonusTable.테메르
  );
}

function getBasePrice(
  refineTable: AdvancedRefineTable,
  priceTable: Record<string, number>
) {
  return Object.entries(refineTable.amount)
    .map(([name, amount]) => priceTable[name] * amount)
    .reduce((sum, x) => sum + x, 0);
}

function getSortedBreathByPrice(
  refineTable: AdvancedRefineTable,
  priceTable: Record<string, number>
) {
  return Object.entries(refineTable.breath)
    .map(([name, amount]) => ({
      name,
      amount,
      price: priceTable[name] * amount,
    }))
    .sort((a, b) => a.price - b.price)
}

function getPaper(
  refineTable: AdvancedRefineTable,
  priceTable: Record<string, number>
) {
  return Object.entries(refineTable.paper)
    .map(([name, amount]) => ({
      name,
      amount,
      price: priceTable[name] * amount,
    }))
}

function getExpectedTryCount(
  breathCounts: { normal: {breath: number, paper: number}; bonus: {breath: number, paper: number} },
  maxCount: { breath: number; paper: number },
  isT3: boolean
) {
  const exp =
    getAverageNormalExp({breath: breathCounts.normal.breath, paper: breathCounts.normal.paper}, {breath: maxCount.breath, paper: maxCount.paper}, isT3) *
      (1 - BONUS_RATE) +
    getAverageBonusExp({breath: breathCounts.bonus.breath, paper: breathCounts.bonus.paper}, {breath: maxCount.breath, paper: maxCount.paper}, isT3) * BONUS_RATE;

  return TOTAL_EXP / exp;
}

function getExpectedPricePerTry(
  refineTable: AdvancedRefineTable,
  priceTable: Record<string, number>,
  counts: { normal: {breath: number, paper: number}; bonus: {breath: number, paper: number} },
  maxCount: { breath: number; paper: number }
) {
  const sortedBreath = getSortedBreathByPrice(refineTable, priceTable);
  const paper = getPaper(refineTable, priceTable);
  const basePrice = getBasePrice(refineTable, priceTable);

  const normalPrice =
    basePrice * (1 - FREE_RATE) +
    sortedBreath
      .slice(0, counts.normal.breath)
      .reduce((sum, x) => sum + x.price, 0) +
    (counts.normal.paper > 0 ? paper[0].price : 0);
  const bonusPrice =
    basePrice +
    sortedBreath
      .slice(0, counts.bonus.breath)
      .reduce((sum, x) => sum + x.price, 0) +
    (counts.bonus.paper > 0 ? paper[0].price : 0);

  return normalPrice * (1 - BONUS_RATE) + bonusPrice * BONUS_RATE;
}

export function getReport(
  refineTable: AdvancedRefineTable,
  priceTable: Record<string, number>
): AdvancedRefineReport[] {
  const result = [];
  const sortedBreath = getSortedBreathByPrice(refineTable, priceTable);
  const paper = getPaper(refineTable, priceTable);
  const isT3 = Object.keys(refineTable.breath).length == 3;
  const maxBreathCount = Object.keys(refineTable.breath).length
  const maxPaperCount = Object.keys(refineTable.paper).length;

  for (let normalBreath = 0; normalBreath <= maxBreathCount; normalBreath++) {
    for (let bonusBreath = 0; bonusBreath <= maxBreathCount; bonusBreath++) {
      for(let normalPaper = 0; normalPaper <= maxPaperCount; normalPaper++) {
        for(let bonusPaper = 0; bonusPaper <= maxPaperCount; bonusPaper++) {
          const expectedTryCount = getExpectedTryCount(
            {
              normal: {breath: normalBreath, paper: normalPaper},
              bonus: {breath: bonusBreath, paper: bonusPaper},
            },
            { breath: maxBreathCount, paper: maxPaperCount },
            isT3,
          );
          const expectedPricePerTry = getExpectedPricePerTry(
            refineTable,
            priceTable,
            {
              normal:{breath: normalBreath, paper: normalPaper},
              bonus: {breath: bonusBreath, paper: bonusPaper},
            },
            { breath: maxBreathCount, paper: maxPaperCount },
          );

          const expectedMaterials = [
            ...Object.entries(refineTable.amount).map(([name, amount]) => ({
              name,
              amount:
                amount *
                expectedTryCount *
                ((1 - BONUS_RATE) * (1 - FREE_RATE) + BONUS_RATE),
            })),
            ...sortedBreath.map((x, index) => {
              const normalAmount = index < normalBreath ? x.amount : 0;
              const bonusAmount = index < bonusBreath ? x.amount : 0;

              return {
                name: x.name,
                amount:
                  (normalAmount * (1 - BONUS_RATE) + bonusAmount * BONUS_RATE) *
                  expectedTryCount,
              };
            }),
            ...paper.map((x, index) => {
              const normalAmount = normalPaper == 1 ? x.amount : 0;
              const bonusAmount = bonusPaper == 1 ? x.amount : 0;

              return {
                name: x.name,
                amount:
                  (normalAmount * (1 - BONUS_RATE) + bonusAmount * BONUS_RATE) *
                  expectedTryCount,
              }
            })
          ];

          result.push({
            normalBreathNames: sortedBreath
              .slice(0, normalBreath)
              .map((x) => x.name),
            bonusBreathNames: sortedBreath.slice(0, bonusBreath).map((x) => x.name),
            normalPaperNames: normalPaper == 1 ? paper.map((x) => x.name) : [],
            bonusPaperNames: bonusPaper == 1 ? paper.map((x) => x.name) : [],
            expectedTryCount,
            expectedPrice: expectedTryCount * expectedPricePerTry,
            expectedMaterials,
          });
        }
      }
    }
  }

  return result.sort((a, b) => a.expectedPrice - b.expectedPrice);
}
