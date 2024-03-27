import { parse, type BaseSchema } from "valibot"

export function wrap<TSchema extends BaseSchema<unknown, unknown>>(
    schema: TSchema
) {
    return (input: unknown) => parse(schema, input)
}
