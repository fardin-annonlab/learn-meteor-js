import { Template } from 'meteor/templating';
import './App.html';
import { TasksCollection } from "../api/TasksCollection";


Template.mainContainer.helpers({
    tasks() {
        return TasksCollection.find({}, { sort: { createdAt: -1 } });
    },
    // tasks: [
    //     { text: 'This is task 1' },
    //     { text: 'This is task 2' },
    //     { text: 'This is task 3' },      
    // ],
    name(){
        return 'I Am Shahid Afridi'
    }
});

Template.form.events({
    'submit .task-form'(events){
        events.preventDefault();
        const target = events.target;
        const task = target.text.value;
        console.log(task);
        TasksCollection.insert({
            text: task,
            createdAt: new Date()
        });

        target.text.value = '';
    }
})