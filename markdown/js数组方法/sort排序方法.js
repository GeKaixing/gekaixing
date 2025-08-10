const num =[6,0,1,2,3,4,5]
console.log(num.sort((a,b)=>a-b));
console.log(num.sort((a,b)=>{
    if(a<b)return -1;
}));
