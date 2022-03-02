const d = document,
  $table = d.querySelector('.crud-table'),
  $form = d.querySelector('.crud-form'),
  $title = d.querySelector('.crud-title'),
  $tempate = d.getElementById('crud-template').content,
  $fragment = d.createDocumentFragment();
const getAll = async () => {
  try{
    let res = await fetch("http://localhost:3000/santos"),
     json = await res.json();
    if (!res.ok) throw {status: res.status, statusText: res.statusText};

    console.log(json);
    json.forEach( el => {
      $tempate.querySelector('.name').textContent = el.nombre;
      $tempate.querySelector('.constellation').textContent = el.constelacion;
      $tempate.querySelector('.edit').dataset.id = el.id;
      $tempate.querySelector('.edit').dataset.name = el.nombre;
      $tempate.querySelector('.edit').dataset.constellation = el.constelacion;
      $tempate.querySelector('.delete').dataset.id = el.id;
      let $clone = d.importNode($tempate,true);
      $fragment.appendChild($clone);
    });
    $table.querySelector('tbody').appendChild($fragment);
  }catch(err){
    let message = err.statusText || `Ocurrio un error`;
    $table.insertAdjacentHTML("afterend",`<p><b>Error ${err.status}: ${message}</b></p>`);
  };
};
d.addEventListener('DOMContentLoaded', getAll);
d.addEventListener('submit',async (e) => {
  if(e.target === $form){
    e.preventDefault();

    if(!e.target.id.value){
      //POST
      try{
        let options = {
          method: 'POST',
          headers: {
            "Content-type": "application/json; charset= utf-8"
          },
          body:JSON.stringify({
            nombre: e.target.nombre.value,
            constelacion: e.target.constelacion.value
          })
        },
          res = await fetch('http://localhost:3000/santos', options),
          json = res.json();
          if (!res.ok) throw {status: res.status, statusText: res.statusText};
          location.reload();
      }catch(err){
        let message = err.statusText || 'Ocurrio un error';
        $form.insertAdjacentHTML("afterend",`<p><b>Error: ${err.status}: ${message}</b></p>`);
      };
    }else{
      //PUT
      try{
        let options = {
          method: 'PUT',
          headers: {
            "Content-type": "application/json; charset= utf-8"
          },
          body:JSON.stringify({
            nombre: e.target.nombre.value,
            constelacion: e.target.constelacion.value
          })
        },
          res = await fetch(`http://localhost:3000/santos/${e.target.id.value}`, options),
          json = res.json();
          if (!res.ok) throw {status: res.status, statusText: res.statusText};
          location.reload();
      }catch(err){
        let message = err.statusText || 'Ocurrio un error';
        $form.insertAdjacentHTML("afterend",`<p><b>Error: ${err.status}: ${message}</b></p>`);
      };

    }
  }
});
d.addEventListener('click', async e => {
  if(e.target.matches('.edit')){
    $title.textContent = "Editar Santo";
    $form.nombre.value = e.target.dataset.name;
    $form.constelacion.value = e.target.dataset.constellation;
    $form.id.value = e.target.dataset.id;
  }
  if(e.target.matches('.delete')){
    let isDel = confirm(`¿Deseas eliminar el id ${e.target.dataset.id}?`);
    if (isDel){
      try{
        let options = {
        method: "DELETE",
      };
      const res = await fetch(`http://localhost:3000/santos/${e.target.dataset.id}`,options),
        json = res.json();
        if (!res.ok) throw {status: res.status, statusText: res.statusText};
        location.reload();
      }catch(err){
        let message = err.statusText || 'Ocurrio un error';
        $form.insertAdjacentHTML("afterend",`<p><b>Error: ${err.status}: ${message}</b></p>`);
      };
    };
  };
});