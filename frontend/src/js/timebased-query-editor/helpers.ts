//@ts-ignore
export const allConditionsFilled = timebasedQuery =>
  timebasedQuery.conditions.every(
    //@ts-ignore
    condition => !!condition.result0 && !!condition.result1
  );

//@ts-ignore
export const anyConditionFilled = timebasedQuery =>
  timebasedQuery.conditions.some(
    //@ts-ignore
    condition => condition.result0 || condition.result1
  );
