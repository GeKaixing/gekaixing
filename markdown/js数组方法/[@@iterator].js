const num=[0,1,2,3,4,5]
const num1=num[Symbol.iterator]()
for(const value of num1){
    console.log(
        value
    );
}