export const Schema = z.object({
  经营: z.object({
    资金: z.coerce.number().prefault(0),
    欠款: z.coerce.number().prefault(10000000),
    剩余天数: z.coerce.number().transform((v) => _.clamp(v, 0, 999)).prefault(30),
    评价: z.coerce.number().transform((v) => _.clamp(v, 0, 100)).prefault(0),
    色情评价: z.coerce.number().transform((v) => _.clamp(v, 0, 100)).prefault(0),
  }).prefault({}),
  佑树: z.object({
    恋人: z.enum(['无', '葵', '美月']).prefault('无'),
    绿帽度: z.coerce.number().transform((v) => _.clamp(v, 0, 100)).prefault(0),
    知情度: z.enum(['不知情', '怀疑', '知情']).prefault('不知情'),
  }).prefault({}),
  葵: z.object({
    好感度: z.coerce.number().transform((v) => _.clamp(v, 0, 999)).prefault(60),
    性欲: z.coerce.number().transform((v) => _.clamp(v, 0, 999)).prefault(0),
    醉酒度: z.coerce.number().transform((v) => _.clamp(v, 0, 100)).prefault(0),
    状态: z.enum(['处女', '有经验', '色情', '淫乱']).prefault('处女'),
    怀孕对象: z.enum(['无', '佑树', '罗伊', '客人', '雷纳德']).prefault('无'),
  }).prefault({}),
  美月: z.object({
    好感度: z.coerce.number().transform((v) => _.clamp(v, 0, 999)).prefault(60),
    性欲: z.coerce.number().transform((v) => _.clamp(v, 0, 999)).prefault(0),
    醉酒度: z.coerce.number().transform((v) => _.clamp(v, 0, 100)).prefault(0),
    状态: z.enum(['处女', '有经验', '色情', '淫乱']).prefault('处女'),
    怀孕对象: z.enum(['无', '佑树', '罗伊', '客人', '雷纳德']).prefault('无'),
  }).prefault({}),
  罗伊: z.object({
    好感度: z.coerce.number().transform((v) => _.clamp(v, 0, 999)).prefault(0),
    目标: z.enum(['葵', '美月', '无']).prefault('无'),
  }).prefault({}),
  客人: z.object({
    好感度: z.coerce.number().transform((v) => _.clamp(v, 0, 999)).prefault(0),
    目标: z.enum(['葵', '美月', '无']).prefault('无'),
  }).prefault({}),
  托米: z.object({
    好感度: z.coerce.number().transform((v) => _.clamp(v, 0, 999)).prefault(0),
    目标: z.enum(['葵', '美月', '无']).prefault('无'),
  }).prefault({}),
  雷纳德: z.object({
    好感度: z.coerce.number().transform((v) => _.clamp(v, 0, 999)).prefault(0),
    目标: z.enum(['葵', '美月', '无']).prefault('无'),
  }).prefault({}),
  当前场景: z.string().prefault('酒馆'),
  当前时间: z.string().prefault('第1天 黄昏'),
}).prefault({});

export type StatData = z.infer<typeof Schema>;
