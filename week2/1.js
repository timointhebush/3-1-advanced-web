//구조분해 할당
const array = ['nodejs', {}, 10, true];
const [node, obj, , bool] = array;
console.log(node);
console.log(obj);
console.log(bool);