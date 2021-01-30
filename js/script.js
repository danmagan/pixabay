const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const divPaginador = document.querySelector("#paginacion");
const registros = 40;

let totalPaginas;
let iterador;
let actual = 1;

window.onload = () => {
	formulario.addEventListener("submit", validarForm);
}

function validarForm(e){
	e.preventDefault();
	const valorBusqueda = document.querySelector("#valor").value;

	if(valorBusqueda === ""){
		mostrarError("Campo Vacio!");

		setTimeout(() => {
			const msj = document.querySelector("#mensaje");
			msj.textContent = "";
			valor.classList.remove("error");
		}, 2000)
		return;
	}

	nuevaBusqueda();
}

function mostrarError(mensaje){
	const msj = document.querySelector("#mensaje");
	const valor = document.querySelector("#valor");
	msj.textContent = mensaje;
	valor.classList.add("error");
}

function nuevaBusqueda(){
	const valor = document.querySelector("#valor").value;
	const key = "20047269-4fb1ae037afe7e12d1ec60bdb";
	const url = `https://pixabay.com/api/?key=${key}&q=${valor}&page=${actual}`;

	fetch(url)
		.then(respuesta => respuesta.json())
		.then(resultado => {
			totalPaginas = calcularPaginacion(resultado.totalHits);
			imprimirResultados(resultado.hits);
		});
}

function calcularPaginacion(total){
	return parseInt(Math.ceil(total / registros));
}

function *generarPaginador(total){
	for(i = 1; i <= total ; i++){
		yield i;
	}
}

function imprimirResultados(imagenes){
	while(resultado.firstChild){
		resultado.removeChild(resultado.firstChild);
	}

	imagenes.forEach(imagen => {
		const { previewURL, likes, views, largeImageURL } = imagen;

		resultado.innerHTML += 
		`<div class="divIMG w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
			<div class="bg-white">
			<img class="w-full" src="${previewURL}"></img>
			<a href="${largeImageURL}" class="btnImg block aColor text-white uppercase font-bold text-center rounded mt-5 p-1" target="_blank" rel="noopener noreferrer">Ver Imagen</a>
			</div>
		</div>`
	})

	while(divPaginador.firstChild){
		divPaginador.removeChild(divPaginador.firstChild);
	}

	

	crearPaginador();
}

function crearPaginador(){

	iterador = generarPaginador(totalPaginas);

	while(true){
		const {done, value} = iterador.next();
		
		if(done) return;
		const boton = document.createElement("a");
		boton.dataset.pagina = value;
		boton.value = value;

		boton.onclick = () => {
			actual = value;
			nuevaBusqueda();
		}

		boton.textContent = value;
		boton.classList.add("abc", "px-3", "font-bold", "mb-4", "rounded","mr-2", "py-0.5","uppercase");
		divPaginador.appendChild(boton);
	}
 }
