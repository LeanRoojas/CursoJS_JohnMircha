const d = document,
  $table = d.querySelector('.crud-table'),
  $form = d.querySelector('.crud-form'),
  $title = d.querySelector('.crud-title'),
  $fragment = d.createDocumentFragment();
const ajax = (options) => {
  let {url, method, succes, error, data} = options;
  const xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", e =>{
    if(xhr.readyState !== 4) return;
    if(xhr.status >= 200 && xhr.status <= 300){
      let json = JSON.parse(xhr.responseText);
      succes(json);

    }else{
      let message = xhr.statusText || "Ocurrio un error";
      error(`Error ${xhr.status}: ${message}`);
    }

  })

  xhr.open(method || "GET", url);
  xhr.setRequestHeader("content-type","application/json; charset=utf-8");
  xhr.send(JSON.stringify(data));
}
const getAll = () => {
  ajax(
    {
      url:"http://localhost:3000/santos",

      succes: (res)=>{
        console.log(res)
        res.forEach(el => {
          const tr = d.createElement('tr'),
            td1 = d.createElement('td'),
            td2 = d.createElement('td'),
            td3 = d.createElement('td'),
            button1 = d.createElement('button'),
            button2 = d.createElement('button');
          
          td1.textContent = el.nombre;
          td2.textContent = el.constelacion;
          button1.textContent = "Editar";
          button2.textContent = "Elimninar";
          button1.setAttribute('id','edit');
          button2.setAttribute('id','delete');

          button1.dataset.id = el.id;
          button2.dataset.id = el.id;
          button1.dataset.name = el.nombre;
          button1.dataset.constellation = el.constelacion;

          tr.appendChild(td1);
          tr.appendChild(td2);
          td3.appendChild(button1);
          td3.appendChild(button2);
          tr.appendChild(td3);
          $fragment.appendChild(tr);
        });
        $table.querySelector('tbody').appendChild($fragment);
      },

      error: (err)=>{
        console.log(err)
        $table.insertAdjacentHTML('afterend',`<p><b>${err}</b></p>`);
      },
    }
  )


}
d.addEventListener("DOMContentLoaded", getAll);
d.addEventListener('submit', e => {
  if(e.target === $form){
    e.preventDefault();

    if(!e.target.id.value){
      // do a POST
      ajax({
        url: "http://localhost:3000/santos",
        method: "POST",
        succes: res => {location.reload()},
        error: err => { $form.insertAdjacentHTML('afterend',`<p><b>${err}</b></p>`)},
        data: {
          nombre: e.target.nombre.value,
          constelacion: e.target.constelacion.value
        }
      });
    }else{
      //do a PUT
      ajax({
        url: `http://localhost:3000/santos/${e.target.id.value}`,
        method: "PUT",
        succes: res => {location.reload()},
        error: err => { $form.insertAdjacentHTML('afterend',`<p><b>${err}</b></p>`)},
        data: {
          nombre: e.target.nombre.value,
          constelacion: e.target.constelacion.value
        }
      });
    }
  }
});
d.addEventListener("click", e => {
  if(e.target.matches('#edit')){
    $title.textContent = "Editar Santo";
    $form.nombre.value = e.target.dataset.name;
    $form.constelacion.value = e.target.dataset.constellation;
    $form.id.value = e.target.dataset.id;
  }
  if(e.target.matches('#delete')){
    let isDel = confirm(`¿Deseas eliminar el id ${e.target.dataset.id}?`);

    if (isDel){
      ajax({
        url: `http://localhost:3000/santos/${e.target.dataset.id}`,
        method: "DELETE",
        succes: res => {location.reload()},
        error: err => {alert(err)}
      });
    };
  };
});