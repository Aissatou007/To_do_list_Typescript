import fs from 'fs';
import inquirer from 'inquirer';
import { Task } from './models';
const File_Path = "task.json";
function loadTask():Task[]{
   if(!fs.existsSync(File_Path))return []
    const data = fs.readFileSync(File_Path,"utf-8")//ici on lit un fichier qui devra etre envoyé e string grace au utf-8
   return JSON.parse(data);//le JSON.parse vas te permettre de convertir les données contenue dans data en format json et il sera un objet
}
function saveTask(tasks:Task[]){
  fs.writeFileSync(File_Path, JSON.stringify(tasks,null,2));//Le JSON.stringify te permet de convertir le fihier sous format json et le null plus le 2 sont la pour l'indentation comme ca le tout ne sera pas sur une même ligne 
}
async function main() {
  const task:Task[] =loadTask();
  const {action} =await inquirer.prompt (
    [
     {
        type: 'list',
        name: 'action',
        message: 'Bienvenue ',
        choices:[
          "Ajouter une tâche",
          "Lister tâche",
          "Modifier tâhe",
          "Supprimer tâche"
        ]
      }
    ]);
  switch (action){
    case "Ajouter une tâche":
      const {describe , title} =  await inquirer.prompt([
            {
              type:"input",
              name:"title",
              message:"Quel est le nom de votre tâche :"
            },
            {
              type:"input",
              name:"describe",
              message:"Quel description pour votre tache :"
            }
      ]);
      task.push({
        id:Date.now(),
        name:title,
        describe:describe,
        itsdone:false
      })
      saveTask(task)
      console.log("Tâche ajoutée");
      
    break;
    case"Lister tâche":
      const {select} = await inquirer.prompt([
        {
          type:"list",
          name:"select",
          message:"La liste de vos tâche",
          choices:task.map((t)=>({name:`${t.name}-${t.itsdone? 'Terminé':"Pas fini"}`, value:t.id}))//le map créer un nouveau tableau en transformant haque élément 
        }
      ])
      const value = task.find((t)=>t.id == select)
      if(value?.itsdone==true){
        console.log("Tâche déja terminé");
      } else {
        const {etat} = await inquirer.prompt([
          {
            type:"confirm",
            name:"etat",
            message:" La tâche est elle terminé ?"
          }
        ]);
        if(etat){
          const taskFind = task.find(t=>t.id == select);
          if(taskFind){
            taskFind.itsdone = true
            saveTask(task);
            console.log("Tâche marquer terminer"); 
          }
        }
      
      }
    break;
    case "Modifier tâhe":
      const {update} = await inquirer.prompt ([
        {
          type:"list",
          name:"update",
          message:"Quel tâche souhaitez-vous modifier ?",
          choices:task.map((t)=>({name:t.name, value:t.id}))
        }
      ]);
      const tas = task.find((t) => t.id === update);

if (!tas) {
  console.log("Tâche introuvable");
} else {
  const { newtitle } = await inquirer.prompt([
    {
      type: "input",
      name: "newtitle",
      message: "Quel est le nouveau nom ?",
    },
  ]);

  tas.name = newtitle; 

  saveTask(task);
  console.log("Tâche modifiée avec succès");
}
break;

    case "Supprimer tâche" : 
    const {selectedTodelate}= await inquirer.prompt([
        {
          type:"list",
          name:"selectedTodelate",
          message:"Quelle tâche souhaitez vous supprimer ",
          choices:task.map((t)=>({name:t.name,value:t.id}))
        }
    ]);
    const delate = task.filter((t)=>t.id !== selectedTodelate);
    saveTask(delate);
    console.log(`Tâche  supprimer avec succès !`);
    break;
  }
  await main()
} main()


