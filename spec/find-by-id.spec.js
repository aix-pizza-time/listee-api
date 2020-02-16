Array.prototype.findById = function(id1) {
    console.log(this);
    if(typeof id !== 'string'){
        return null;
    } else {
        return this.find((v) => v.id === id);
    }
};

let a = [
    {
        id: '0',
        value: '0'
    },
    {
        id: '1',
        value: '1'
    }
];

console.log(a.findById('0'));