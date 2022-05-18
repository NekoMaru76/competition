import {
    createSchema,
    Type
} from "ts-mongoose";

const name = "User";
const schema = createSchema({
    id: Type.string({ required: true }),
    titleId: Type.string({
        required: true,
        default: "0"
    }),
    win: Type.number({
        required: true,
        default: 0
    }),
    draw: Type.number({
        required: true,
        default: 0
    }),
    lose: Type.number({
        required: true,
        default: 0
    })
}, {
    timestamps: {
        createdAt: "createdAt"
    }
});

export {
    name,
    schema
};