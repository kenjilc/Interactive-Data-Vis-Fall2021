let clickNumber = 0;
const userMessage="Number of times the button has been clicked without reloading the page: ";
const userMessageInput="The User has left the following message in the input box: "
document.getElementById('countMessage').innerHTML =userMessage + clickNumber

const pageUpdate = () =>
{
    clickNumber = clickNumber +1;
    document.getElementById('countMessage').innerHTML =userMessage + clickNumber + "</br> </br> </br>" + userMessageInput +  document.getElementById('userText').value+"</br> </br> </br>";
}