export interface AdvancedRefineTable {
  amount: Record<string, number>;
  breath: Record<string, number>;
  paper: Record<string, number>;
}

export type AdvancedRefineTarget = 't3_0' | 't3_1' | 't4_0' | 't4_1' | 't4_2' | 't4_3';

export const advancedRefineTable: Record<
  'armor' | 'weapon',
  Record<AdvancedRefineTarget, AdvancedRefineTable>
> = {
  armor: {
    t3_0: {
      amount: {
        정제된수호강석: 950,
        찬명돌: 22,
        최상급오레하: 18,
        파편: 5500,
        골드: 950,
      },
      breath: {
        은총: 24,
        축복: 12,
        가호: 4,
      },
      paper: {
        장인재봉술1:1,
      },
    },
    t3_1: {
      amount: {
        정제된수호강석: 1300,
        찬명돌: 28,
        최상급오레하: 20,
        파편: 11000,
        골드: 1800,
      },
      breath: {
        은총: 36,
        축복: 18,
        가호: 6,
      },
      paper: {
        장인재봉술2:1,
      },
    },
    t4_0: {
      amount: {
        운명의수호석: 500,
        운돌: 12,
        아비도스: 15,
        운명파편: 3000,
        골드: 950,
      },
      breath: {
        빙하: 12,
      },
      paper: {
        장인재봉술1:1,
      },
    },
    t4_1: {
      amount: {
        운명의수호석: 900,
        운돌: 16,
        아비도스: 16,
        운명파편: 6000,
        골드: 1800,
      },
      breath: {
        빙하: 18,
      },
      paper: {
        장인재봉술2:1,
      },
    },
    t4_2: {
      amount: {
        운명의수호석: 1000,
        운돌: 18,
        아비도스: 17,
        운명파편: 7000,
        골드: 2000,
      },
      breath: {
        빙하: 20,
      },
      paper:{

      },
    },
    t4_3: {
      amount: {
        운명의수호석: 1200,
        운돌: 23,
        아비도스: 19,
        운명파편: 8000,
        골드: 2400,
      },
      breath: {
        빙하: 24,
      },
      paper: {
      },
    },
  },
  weapon: {
    t3_0: {
      amount: {
        정제된파괴강석: 1000,
        찬명돌: 28,
        최상급오레하: 30,
        파편: 9000,
        골드: 1125,
      },
      breath: {
        은총: 24,
        축복: 12,
        가호: 4,
      },
      paper: {
        장인야금술1:1,
      },
    },
    t3_1: {
      amount: {
        정제된파괴강석: 1600,
        찬명돌: 36,
        최상급오레하: 33,
        파편: 17000,
        골드: 2500,
      },
      breath: {
        은총: 36,
        축복: 18,
        가호: 6,
      },
      paper: {
        장인야금술2:1,
      },
    },
    t4_0: {
      amount: {
        운명의파괴석: 600,
        운돌: 16,
        아비도스: 25,
        운명파편: 5000,
        골드: 1125,
      },
      breath: {
        용암: 12,
      },
      paper: {
        장인야금술1:1,
      },
    },
    t4_1: {
      amount: {
        운명의파괴석: 1100,
        운돌: 22,
        아비도스: 27,
        운명파편: 10000,
        골드: 2500,
      },
      breath: {
        용암: 18,
      },
      paper: {
        장인야금술2:1,
      },
    },
    t4_2: {
      amount: {
        운명의파괴석: 1200,
        운돌: 25,
        아비도스: 28,
        운명파편: 11500,
        골드: 3000,
      },
      breath: {
        용암: 20,
      },
      paper: {}
    },
    t4_3: {
      amount: {
        운명의파괴석: 1400,
        운돌: 32,
        아비도스: 30,
        운명파편: 13000,
        골드: 4000,
      },
      breath: {
        용암: 24,
      },
      paper: {},
    },
  },
};

export function getAdvancedRefineTable(
  type: 'armor' | 'weapon',
  target: AdvancedRefineTarget
): AdvancedRefineTable {
  return advancedRefineTable[type][target];
}
