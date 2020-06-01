<script>
    import { onMount } from 'svelte';
    import { scale } from 'svelte/transition';

    let editing_prio = false;
    let todos = [];
    let todo = {
        id: 0,
        stato: "NONE",
        task: "",
        owner: "",
        scadenza: "",
        prio: ""
    };

    $: console.log(todos)
    
    onMount(async () => {
        todos = JSON.parse(localStorage.getItem("todos") || "[]");
    });

    function newToDo() {
        todo = {
            id: Date.now(),
            stato: "NONE",
            task: "todo",
            owner: "Antonio",
            scadenza: new Date().toISOString().slice(0, 10),
            prio: "BASSA",
        };  
    }
    
    function addToDo() {
        newToDo();
        todos =  [...todos, todo];
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    
    function cambiaStato(id) {
        var todo = todos.find(function(element) {
            return element.id  == id;
        });
        let idx = todos.indexOf(todo);
        todos[idx].stato = (todos[idx].stato == "NONE" ? "WIP" : todos[idx].stato == "WIP"? "DONE" : "NONE");
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function salvaTask() {
        todos =  [...todos];
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function deleteToDo(id) {
        todos = todos.filter(item => item.id !== Number(id));
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function prio2Class(prio) {
        var classe = "";
        switch (prio) {
            case "BASSA":
                classe = "success";
                break;
            case "MEDIA":
                classe = "warning";
                break;
            case "ALTA":
                classe = "danger";
                break;
            default:
                classe = "danger";
        }
        return classe;
    }

    function scadenza2Class(scadenza) {
        let data_scadenza = new Date(scadenza);
        let now = new Date(Date.now());
        let ndays = Math.round((data_scadenza.getTime() - now.getTime()) / (1000 * 3600 * 24)) + 1; 
        
        if (ndays < 2)
            return "alto";
        else if (ndays >= 2 && ndays < 5)
            return "medio";
        else
            return "basso";
    }

    function compare_prio(a, b){
        if(a.prio == "ALTA" &&  b.prio == "MEDIA")
            return -1;
        else if(a.prio == "ALTA" &&  b.prio == "BASSA")
            return -1;
        else if(a.prio == "MEDIA" &&  b.prio == "BASSA")
            return -1;
        else if(a.prio == "MEDIA" &&  b.prio == "ALTA")
            return 1;
        else if(a.prio == "BASSA" &&  b.prio == "ALTA")
            return 1;
        else if(a.prio == "BASSA" &&  b.prio == "MEDIA")
            return 1;
        else
            return 0;
    }

    function compare_date(a, b){
        if(a.scadenza < b.scadenza)
            return -1;
        else if(a.scadenza > b.scadenza)
            return 1;
        else
            return 0;
    }

    function compare_owner(a, b){
        if(a.owner < b.owner)
            return -1;
        else if(a.owner > b.owner)
            return 1;
        else
            return 0;
    }
    
    function compare_stato(a, b){
        if(a.stato == "NONE" &&  b.stato == "WIP")
            return -1;
        else if(a.stato == "NONE" &&  b.stato == "DONE")
            return -1;
        else if(a.stato == "WIP" &&  b.stato == "DONE")
            return -1;
        else if(a.stato == "WIP" &&  b.stato == "NONE")
            return 1;
        else if(a.stato == "DONE" &&  b.stato == "NONE")
            return 1;
        else if(a.stato == "DONE" &&  b.stato == "WIP")
            return 1;
        else
            return 0;
    }

    function sort_by(comparator) {
        todos.sort(comparator);
        todos =  [...todos];
    }

</script>

<style>
    .todo-header {
        margin-top: 20px;
    }

    .todo-header-cell {
        background-color: transparent;
        border: 1px solid #E7ECEE;
        border-top: none;
        padding: 10px;
        padding-bottom: 20px;
        color: #151b26;
    }

    .todo-item {
        background-color: #FFFFFF;
    }

    .todo-item:hover {
        border-bottom: 1px solid #D7E0E5;
        border-left: 0px;
        border-right: 0px;
    }

    .todo-item-cell {
        background-color: transparent;
        border: 1px solid #E7ECEE;
        color: #151b26;
        padding: 10px;
        padding-top: 5px;
        padding-bottom: 5px; 
    }

    .todo-item-input-text {
        width: 100%;
        border: 0px;
    }

    .todo-item-input-text:hover  {
    }

    .todo-item-input-text:focus  {
        background-color: #ffffff;
        font-weight: bold;
    }

    .icon-24 {
        width: 24px;
        height: 24px;
    }

    .icon-32 {
        width: 32px;
        height: 32px;
    }

    .scadenza {
        height: 100%;
        border-radius: 0.25em;
        color: #ffffff;
        font-weight: 700;
        line-height: 1;
        text-align: center;
        white-space: nowrap;
        border-radius: .25rem;
    }

    .scadenza.alto {
        border: 0px;
        background-color: #dc3545;
    }

    .scadenza.medio {
        border: 0px;
        background-color: #ffc107;
    }

    .scadenza.basso {
        border: 0px;
        background-color: #28a745;
    }

    .app-title {
        font-family: 'Permanent Marker', cursive;
        text-align: left;
        margin-bottom: 0px;
        font-size: 60px;
        opacity: 0.5;
    }

</style>

<main>
<div class="container">
    <h1 class="app-title">todos</h1>
    <div class="row todo-header">
        <div class="col-md-1 todo-header-cell border-left-0 text-muted text-center"><svg class="icon-32" fill="#28a745" on:click={function() {sort_by(compare_stato)}}><use href="#stato-icon"></use></svg>
        </div>
        <div class="col-md-6 todo-header-cell border-left-0 text-muted"><svg class="icon-32" fill="#28a745"><use href="#task-icon"></use></svg>
        </div>
        <div class="col-md-1 todo-header-cell  border-left-0 text-muted text-center"><svg class="icon-32" fill="#28a745" on:click={function() {sort_by(compare_owner)}}><use href="#owner-icon"></use></svg>
        </div>
        <div class="col-md-2 todo-header-cell border-left-0 text-muted text-center"><svg class="icon-32" fill="#28a745" on:click={function() {sort_by(compare_date)}}><use href="#sveglia-icon"></use></svg>
        </div>
        <div class="col-md-1 todo-header-cell  border-left-0 text-muted text-center"><svg class="icon-32" fill="#28a745" on:click={function() {sort_by(compare_prio)}}><use href="#prio-icon"></use></svg>
        </div>
        <div class="col-md-1 todo-header-cell border-left-0 border-right-0 text-center"><svg class="icon-32" fill="#28a745" on:click={addToDo}><use href="#add-item-icon"></use></svg>
        </div>
    </div>
    
    {#if todos.length > 0} 
    {#each todos as todo, i (todo.id)}
    <div class="row todo-item" transition:scale="{{duration: 300, delay: 50}}">
        <div class="col-md-1 todo-item-cell border-left-0 text-center" on:click|preventDefault={() => cambiaStato(todo.id)}>
        {#if todo.stato === "NONE"}
            <svg class="icon-24" fill="#dc3545"><use href="#uncheck-item-icon"></use></svg>
        {:else if todo.stato === "WIP"}
            <svg class="icon-24" fill="#ffc107"><use href="#wip-item-icon"></use></svg>
        {:else if todo.stato === "DONE"}
            <svg class="icon-24" fill="#28a745"><use href="#done-item-icon"></use></svg>
        {/if}         
        </div>
        <div class="col-md-6 todo-item-cell border-left-0">
            <input type="text" class="todo-item-input-text" id="task{todo.id}" placeholder="ToDo" bind:value={todo.task} on:change|preventDefault={function() {document.getElementById("task" + todo.id).blur(); salvaTask()}}>
        </div>
        <div class="col-md-1 todo-item-cell border-left-0">
                <input type="text" class="todo-item-input-text text-center" id="owner{todo.id}" placeholder="ToDo" bind:value={todo.owner} on:change|preventDefault={function() {document.getElementById("owner" + todo.id).blur(); salvaTask()}}>
        </div>
        <div class="col-md-2 todo-item-cell border-left-0 text-center"><!-- <span class="badge badge-success">22/06</span> -->
            
            <input type="date" id="scadenza{todo.id}"  min="2020-01-01" max="2028-12-31" class="scadenza {scadenza2Class(todo.scadenza)}" bind:value={todo.scadenza} on:change|preventDefault={function() {document.getElementById("scadenza" + todo.id).blur(); salvaTask()}}>
        </div>
        <div class="col-md-1 todo-item-cell border-left-0 text-center">
            {#if editing_prio == false}
                <span class="badge  p-2 badge-{prio2Class(todo.prio)}" on:click|preventDefault={function() {editing_prio = true;}}>{todo.prio}</span>
            {:else if editing_prio == true}
                <select id="prio{todo.id}" title="Scegli una opzione" bind:value={todo.prio} on:change|preventDefault={function() {document.getElementById("prio" + todo.id).blur(); editing_prio = false; salvaTask();}}>
                    <option value="ALTA">ALTA</option>
                    <option value="MEDIA">MEDIA</option>
                    <option value="BASSA">BASSA</option>
                </select>
            {/if}
        </div>
         <div class="col-md-1 todo-item-cell border-left-0 border-right-0 text-center">
            <a href="/" on:click|preventDefault={() => deleteToDo(todo.id)}>
                <svg class="icon-24" fill="red"><use href="#delete-icon"></use></svg>
            </a>
        </div>
    </div>
    {/each}
    {:else}
    <div class="row">
        <div class="col" style="padding: 30px;">
            <div class="jumbotron">
                <h1 class="app-title">todos</h1>
                <p>Semplice todo list sviluppata in Svelte!!!</p>
                <hr class="my-4">
                <p>Aggiungi un nuovo task premendo &nbsp; &nbsp; <svg class="icon-32" fill="green" on:click={addToDo}><use href="#add-item-icon"></use></svg></p>
                <p>Puoi editare il task clickando direttamente nelle celle.</p>
                <p>Puoi ordinare clickando sulle icone delle colonne.</p>
            </div>
        </div>
    </div>
    {/if}
</div>
    
<svg>
    <defs>
    <symbol id="wip-item-icon" class="bi bi-check-circle" width="1.5em" height="1.5em" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>    
    </symbol>
    <symbol id="done-item-icon" class="bi bi-check-circle-fill" width="1.5em" height="1.5em" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
    </symbol>
    <symbol id="uncheck-item-icon" lass="bi bi-circle" width="1.5em" height="1.5em" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
    </symbol>
    <symbol id="delete-icon" class="bi bi-trash" width="1.5em" height="1.5em" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M6.603 2h7.08a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-7.08a1 1 0 0 1-.76-.35L1 8l4.844-5.65A1 1 0 0 1 6.603 2zm7.08-1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1h7.08z"/>
        <path fill-rule="evenodd" d="M5.83 5.146a.5.5 0 0 0 0 .708l5 5a.5.5 0 0 0 .707-.708l-5-5a.5.5 0 0 0-.708 0z"/>
        <path fill-rule="evenodd" d="M11.537 5.146a.5.5 0 0 1 0 .708l-5 5a.5.5 0 0 1-.708-.708l5-5a.5.5 0 0 1 .707 0z"/>
    </symbol>
    <symbol id="add-item-icon" class="bi bi-plus-square-fill" width="2em" height="2em" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/>
        <path fill-rule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/>
        <path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
    </symbol>
    <symbol id="sveglia-icon" class="bi bi-alarm" width="2em" height="2em" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 15A6 6 0 1 0 8 3a6 6 0 0 0 0 12zm0 1A7 7 0 1 0 8 2a7 7 0 0 0 0 14z"/>
        <path fill-rule="evenodd" d="M8 4.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.053.224l-1.5 3a.5.5 0 1 1-.894-.448L7.5 8.882V5a.5.5 0 0 1 .5-.5z"/>
        <path d="M.86 5.387A2.5 2.5 0 1 1 4.387 1.86 8.035 8.035 0 0 0 .86 5.387zM11.613 1.86a2.5 2.5 0 1 1 3.527 3.527 8.035 8.035 0 0 0-3.527-3.527z"/>
        <path fill-rule="evenodd" d="M11.646 14.146a.5.5 0 0 1 .708 0l1 1a.5.5 0 0 1-.708.708l-1-1a.5.5 0 0 1 0-.708zm-7.292 0a.5.5 0 0 0-.708 0l-1 1a.5.5 0 0 0 .708.708l1-1a.5.5 0 0 0 0-.708zM5.5.5A.5.5 0 0 1 6 0h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z"/>
        <path d="M7 1h2v2H7V1z"/>
    </symbol>
    <symbol id="owner-icon" class="bi bi-person-fill" width="2em" height="2em" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M13 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM3.022 13h9.956a.274.274 0 0 0 .014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 0 0 .022.004zm9.974.056v-.002.002zM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
    </symbol>
    <symbol id="prio-icon" class="bi bi-chevron-contract" width="2em" height="2em" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M3.646 13.854a.5.5 0 0 0 .708 0L8 10.207l3.646 3.647a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 0 0 0 .708zm0-11.708a.5.5 0 0 1 .708 0L8 5.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 0-.708z"/>
    </symbol>
    <symbol id="task-icon" class="bi bi-list-task" width="2em" height="2em" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5H2zM3 3H2v1h1V3z"/>
        <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9z"/>
        <path fill-rule="evenodd" d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5V7zM2 7h1v1H2V7zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H2zm1 .5H2v1h1v-1z"/>
    </symbol>
    <symbol id="stato-icon" class="bi bi-info-square" width="2em" height="2em" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z"/>
        <circle cx="8" cy="4.5" r="1"/>
    </symbol>
    </defs>
  </svg>
</main>
