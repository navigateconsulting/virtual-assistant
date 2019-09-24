import { Animator } from './animator';
export const create = (animationBuilder, baseEl, opts) => {
    if (animationBuilder) {
        return animationBuilder(Animator, baseEl, opts);
    }
    return Promise.resolve(new Animator());
};
