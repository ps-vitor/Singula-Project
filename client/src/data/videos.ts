export  interface   Video{
    id:number;
    videoId:string;
    title:string;
    description:string,
}

const   videos:Video[]=[
    {
        id:1,
        title:'Maquiavélicos: A Teoria das Elites',
        videoId:"8XoO6EKN4_E",
        description:"Apresentação sobre as principais contribuições da Teoria das Elites e seu desenvolvimento desde suas origens em Maquiavel até Pareto.\nA principal referência é o livro The Machiavellians: Defenders of Freedom de James Burnham."
    },
    {
        id:2,
        title:'Poesia Épica',
        videoId:"9toNO-T2Bxc",
        description:"Apresentação do Projeto Singula feita no primeiro semestre de 2024 por João P. Smielevski."
    },
    {
        id:3,
        title:'A República',
        videoId:"0D9-4CwPuGQ",
        description:"Uma apresentação da temática da justiça n'A República de Platão realizada no grupo de estudos Singula no dia 01/10/2024 por João Pedro Smielevski."
    }
]

export  default videos;