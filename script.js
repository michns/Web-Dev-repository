let body = document.querySelector('body');
let clickMe = document.querySelector('.click-me');
let hide = document.querySelector('.hide'); 
let expenseHTML = document.querySelector('.expense');
let modelsHTML = document.querySelector('.models');   
let clickMeSpan = document.querySelector('.click-me span'); 
let selectedHTML = document.querySelector('.selectedProducts');   
let models = []; 
let prods = [];    



const insertToHTML = () => {             
    modelsHTML.innerHTML = '';
    if(models.length > 0){
        models.forEach(model => {
            let addedProd = document.createElement('div');   
            addedProd.classList.add('model');
            addedProd.dataset.id = model.id;  
            addedProd.innerHTML = `
            <img src="${model.image}" alt="">
            <p>${model.name}</p>
            <div class="price">$${model.price}</div>
            <button class="addModel">
                Add To List
            </button>
            `;
            modelsHTML.appendChild(addedProd);
        })
    }
}

clickMe.addEventListener('click', () => {
    body.classList.toggle('unfolded')    
})    

hide.addEventListener('click', () => {
    body.classList.toggle('unfolded')   
})    

modelsHTML.addEventListener('click', e =>{    
    let positionClick = e.target;    
    if(positionClick.classList.contains('addModel')){
        let model_id = positionClick.parentElement.dataset.id;
        addToSelected(model_id);
    }
})

const addToSelected = (model_id) => {
    let positionInSelected = prods.findIndex((i) => i.model_id == model_id);
    if(prods.length <= 0){              
        prods = [{
            model_id: model_id,    
            number: 1
        }]
    }else if(positionInSelected < 0){   
        prods.push({                             
            model_id: model_id,
            number: 1
        });
    }else{               
        prods[positionInSelected].number = prods[positionInSelected].number + 1;
    }
    displaySelected(); 
    saveSelected(); 
}

const saveSelected = () => {
    localStorage.setItem('x', JSON.stringify(prods));
}

const displaySelected = () => {
    selectedHTML.innerHTML = '';
    let sum = 0;              
    let expense = 0;
    if(prods.length > 0){
        prods.forEach(x => {
            sum = sum + x.number;
            let selected = document.createElement('div');
            selected.classList.add('model');
            selected.dataset.id = x.model_id; 
            let modelsIndex = models.findIndex((i) => i.id == x.model_id);
            let indicated = models[modelsIndex];
            expense = expense + (indicated.price * x.number);
            selected.innerHTML = `
            <div class="image">
                    <img src="${indicated.image}" alt="">
                </div>
                <div class="name">
                    ${indicated.name}
                </div>
                <div class="sum">
                    $${indicated.price * x.number}
                </div>
                <div class="number">
                    <span class="minus">-</span>
                    <span>${x.number}</span>
                    <span class="plus">+</span>
                </div>
                `;
        selectedHTML.appendChild(selected);
        })
    }
    clickMeSpan.innerText = sum;
    expenseHTML.innerText = `Total expense: $${expense}`;
} 

selectedHTML.addEventListener('click', e => {
    let positionClick = e.target;
    if(positionClick.classList.contains('plus') || positionClick.classList.contains('minus')) {
        let model_id = positionClick.parentElement.parentElement.dataset.id;
        let sign = 'plus';    
        if(positionClick.classList.contains('minus')){
            sign = 'minus';
        }
        addOrRemove(model_id, sign);
    }
})

const addOrRemove = (model_id, sign) => {
    let index = prods.findIndex((i) => i.model_id == model_id);
    if(index >= 0){
        if(sign == 'plus') {
            prods[index].number = prods[index].number + 1;
        }
        if(sign == 'minus') {
            let increment = prods[index].number - 1;
            if(increment > 0) {
                prods[index].number = increment;    
            }
            else {
                prods.splice(index, 1); 
            }                           
        }     
    }
    saveSelected();        
    displaySelected();        
}

const main = () => {
    fetch('models.json')    
    .then(response => response.json())   
    .then(fetchedData => {
        models = fetchedData;
        insertToHTML();

        if(localStorage.getItem('x')){
            prods = JSON.parse(localStorage.getItem('x'));
            displaySelected();        
        }
    })
    
}        

main();
