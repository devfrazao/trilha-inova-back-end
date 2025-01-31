// QUESTÃO 1: Crie uma variável chamada nome e atribua seu nome a ela. Em seguida, exiba o valor dessa variável.
var nome = "Thiago Frazão";
alert("Nome: " + nome);

// QUESTÃO 2: Crie duas variáveis: uma chamada idade e outra chamada altura. Atribua a idade o valor 25 e a altura o valor 1.75. 
// Exiba ambos os valores.
var idade = 25;
let altura = 1.72;
alert(`Idade: ${idade} anos \nAltura: ${altura} Kg`);

// QUESTÃO 3 
// Crie uma variável chamada preco com o valor 50 e uma variável desconto com o valor 0.2 (20%). 
// Calcule o preço com desconto e exiba o valor final.
var preco = 50;
var desconto = 0.2;
var valorDesconto = preco*desconto;
var precoFinal = preco - valorDesconto;
precoFinal = preco - (valorDesconto);
alert(`Preço: R$ ${preco} \nValor do Desconto: R$ ${valorDesconto} \nPreço com desconto: R$ ${precoFinal}`);


// QUESTÃO 4
// Crie uma variável chamada temperatura e atribua o valor 30. Se a temperatura for maior que 25, exiba a mensagem "Está calor!". 
// Caso contrário, exiba "Está fresco!".

var temperatura = 30;
var mensagem = temperatura > 25 ? "Está calor!" : "Está fresco!";
alert(mensagem);

// QUESTÃO 5 
// Crie uma variável idade e atribua um valor. Se a pessoa for maior de idade (18 ou mais), exiba "Você é maior de idade". 
// Caso contrário, exiba "Você é menor de idade".

let idade2 = 20;
if(idade2>=18){
    alert("Você é maior de idade");
}
else{
    alert("Você é menor de idade");
}


// QUESTÃO 6
// Crie uma variável chamada nota e atribua um valor entre 0 e 10. Se a nota for maior ou igual a 7, exiba "Aprovado". 
// Se for entre 5 e 6, exiba "Recuperação". Caso contrário, exiba "Reprovado"

var nota = 10;
if(nota >=7 ){
    alert(`Parabéns! Aprovado com nota ${nota}`);
}
else if(nota < 7 & nota >=5){
    alert(`Recuperação! Sua nota é ${nota}`);
}
else{
    alert(`Reprovado! Sua nota é ${nota}`);
}

// QUESTÃO 7 
// Crie duas variáveis, numero1 e numero2, e atribua valores a elas. Verifique se os dois números são iguais e, caso sejam, 
// exiba "Os números são iguais". Caso contrário, exiba "Os números são diferentes".

let numero1 = 10;
let numero2 = 10;
let message = numero1 == numero2 ? "Os números são iguais" : "Os números são diferentes";
alert(message);

// QUESTÃO 8
// Crie uma variável chamada nome e uma variável chamada idade. Exiba a mensagem "Olá, meu nome é [nome] e eu tenho [idade] anos",
// utilizando concatenação.

var novoNome = "Thiago Frazão";
var idade3 = "35";
alert(`Olá, meu nome é ${nome} e eu tenho ${idade3} anos`);


// QUESTÃO 9
// Crie um loop que imprima os números de 1 a 10 na tela.

/*
for(var i = 1; i <= 10; i++){
    alert("número: " + i);
}
*/

var number = [];
for(var i = 1; i <= 10; i++){
    number[i-1] = i;
}
alert(number); // Foi feito dessa maneira para reduzir a quantidade de caixas de diálogo na tela


// QUESTÃO 10
// Crie um loop que peça ao usuário para digitar um número até que ele digite o número 5.

var numeroDigitado = prompt("Digite um número");

while(numeroDigitado !=5){
    if(numeroDigitado < 5){
        numeroDigitado = prompt("Número deve ser maior"); 
    }
    else{
        numeroDigitado = prompt("Número deve ser menor");
    }
}

// QUESTÃO 11
//Crie um loop que imprima a tabuada do número 7, de 1 a 10.

var numeroTabuada = 7;
var tabuada = `Tabuada do número ${numeroTabuada}\n`;

for(let i = 1; i<=10; i++){
    tabuada += `${numeroTabuada} x ${i} = ${i*numeroTabuada}\n`;
}
alert(tabuada);


// QUESTÃO 12
//Crie um loop que exiba todos os números pares de 0 a 20.

let numerosPares = [];

for(let i = 0; i <= 20; i++){
    if(i%2==0){
        numerosPares.push(i);
    }
}
alert(numerosPares);