const increseCountForComment = (ele) => {
    let commentID = ele.parentNode.parentNode.getAttribute('commentID');
    getData([commentID],'upCountForComment')
}


const decreaseCountForComment = (ele) => {
    let commentID = ele.parentNode.parentNode.getAttribute('commentID');
    getData([commentID],'downCountForComment')
}

const increaseCountForReply = (ele) => {
    let commentID = ele.parentNode.parentNode.getAttribute('commentID');
    let replyID = ele.parentNode.parentNode.getAttribute('replyID');
    getData([commentID,replyID],'upCountForReply')
}

const decreaseCountForReply = (ele) => {
    let commentID = ele.parentNode.parentNode.getAttribute('commentID');
    let replyID = ele.parentNode.parentNode.getAttribute('replyID');
    getData([commentID,replyID],'downCountForReply')
}


const getData = async(arr,task) => {
    try {
        const response = await axios.post('http://localhost:5100/index',{arr,task});
        const userResponse =(response.data);
        console.log(userResponse);
        window.location.reload();
      } catch (errors) {
        console.error(errors);
      }
}

const addComment = () => {
    let newComment = document.getElementById('userCommentTextt').value;
    if(newComment.trim()===''){
        alert("Please enter your comment")
    }
    else{
      const obj = {
        id : document.getElementsByClassName('mainComment').length+1,
        content : newComment,
        createdAt : "Now",
        score : 0 ,
        user: {
            image: { 
              png: "Assets/avatars/image-juliusomo.png",
              webp: "Assets/avatars/image-juliusomo.webp"
            },
            username: "juliusomo",
        },
        replies : [],
    }
    getData(obj , "NewComment")  
    }
    
}

const showNewReply = (ele) => {
    for(let i = 0 ; i<document.getElementsByClassName('mainComment').length ; i++){
        console.log(ele.parentNode.parentNode.parentNode===document.getElementsByClassName('mainComment')[i]);
    if(ele.parentNode.parentNode.parentNode===document.getElementsByClassName('mainComment')[i]){
        document.getElementsByClassName('mainComment')[i].nextElementSibling.style.display='flex'
    }
    else{
        document.getElementsByClassName('mainComment')[i].nextElementSibling.style.display='none'
    }
    }
}

const addNewReply = (ele) => {
   let newReply = ele.previousElementSibling.value;
   if(newReply.trim()===''){
    alert("Please enter your comment")
    }
    else{
        console.log(ele.parentNode.nextElementSibling.children[(ele.parentNode.nextElementSibling.children.length)-1]);
        const obj = {
            id : '',
            content : newReply,
            createdAt : "Now",
            score : 0 ,
            replyingTo : (ele.parentNode.previousElementSibling.children[1].children[0].children[1].innerText).split(' ')[0] ,
            user: {
                image: { 
                  png: "Assets/avatars/image-juliusomo.png",
                  webp: "Assets/avatars/image-juliusomo.webp"
                },
                username: "juliusomo",
            }
        }
        console.log(obj);
        getData([ele.parentNode.previousElementSibling.getAttribute('commentID'),obj],'newReply')
    }
}

const deleteReply = (ele) => {
    let commentID = ele.parentNode.parentNode.parentNode.getAttribute('commentID');
    let replyID = ele.parentNode.parentNode.parentNode.getAttribute('replyID'); 
    getData([commentID,replyID],'deleteReply')
}

const showEditReply =(ele) => {
    ele.parentNode.parentNode.parentNode.nextElementSibling.style.display="flex";
}

const saveNewReply = (ele) => {
    let newReply = ele.previousElementSibling.value;
    if(newReply.trim()===''){
        alert("Please enter your comment")
        }
        else{
            const obj ={
                newReply : newReply,
                commentID : ele.parentNode.previousElementSibling.getAttribute('commentID'),
                replyID : ele.parentNode.previousElementSibling.getAttribute('replyID'),
            }
            getData(obj,'editReply')
        }

}

const showNestedReply = (ele) => {
    ele.parentNode.parentNode.parentNode.nextElementSibling.style.display="flex";
}

const saveNestedReply = (ele) =>{
    let newReply = ele.previousElementSibling.value;
    if(newReply.trim()===''){
        alert("Please enter your comment")
        }
        else{
            const obj = {
                id :'',
                content : newReply,
                createdAt : "Now",
                score : 0 ,
                replyingTo : (ele.parentNode.previousElementSibling.children[1].children[0].children[1].innerText).split(' ')[0] ,
                user: {
                    image: { 
                      png: "Assets/avatars/image-juliusomo.png",
                      webp: "Assets/avatars/image-juliusomo.webp"
                    },
                    username: "juliusomo",
                }
        }
        console.log(obj);
        getData([ele.parentNode.previousElementSibling.getAttribute('commentID'),obj],'newNestedReply')
    }    
}