import { Template } from 'meteor/templating';
import './App.html';
import { TasksCollection } from "../api/TasksCollection";
import './Task.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import "./Login.js";
import '../api/tasksMethods';


const HIDE_COMPLETED_STRING = 'hideCompleted';
const getUser = () => Meteor.user();
const isUserLogged = () => !!Meteor.userId();
const IS_LOADING_STRING = "isLoading";



const getTasksFilter = () => {
  const user = getUser();

  const hideCompletedFilter = { isChecked: { $ne: true } };

  const userFilter = user ? { userId: user._id } : {};

  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  return { userFilter, pendingOnlyFilter };
}


Template.mainContainer.onCreated(function mainContainerOnCreated() {
  this.state = new ReactiveDict();
  this.state.set(HIDE_COMPLETED_STRING, false); 
  const handler = Meteor.subscribe('tasks');
  Tracker.autorun(() => {
    this.state.set(IS_LOADING_STRING, !handler.ready());
  });
});

Template.mainContainer.helpers({
   tasks() {
    const instance = Template.instance();
    const hideCompleted = instance.state.get(HIDE_COMPLETED_STRING);

    const { pendingOnlyFilter, userFilter } = getTasksFilter();

    if (!isUserLogged()) {
      return [];
    }

    return TasksCollection.find(hideCompleted ? pendingOnlyFilter : userFilter, {
      sort: { createdAt: -1 },
    }).fetch();
  },
  hideCompleted() {
    return Template.instance().state.get(HIDE_COMPLETED_STRING);
  },
  name() {
    return 'I Am Shahid Afridi';
  },
  incompleteCount() {
    if (!isUserLogged()) {
      return '';
    }

    const { pendingOnlyFilter } = getTasksFilter();

    const incompleteTasksCount = TasksCollection.find(pendingOnlyFilter).count();
    return incompleteTasksCount ? `(${incompleteTasksCount})` : '';
  },
  isUserLogged() {
    return isUserLogged();
  },
  getUser() {
    return getUser();
  }
});


Template.mainContainer.events({
  "click #hide-completed-button"(event, instance) {
    const current = instance.state.get(HIDE_COMPLETED_STRING);
    instance.state.set(HIDE_COMPLETED_STRING, !current);
  },
  'click .user'() {
    Meteor.logout();
  },
  isLoading() {
    const instance = Template.instance();
    return instance.state.get(IS_LOADING_STRING);
  }
});


Template.form.events({
  'submit .task-form'(events){
    events.preventDefault();
    const target = events.target;
    const task = target.text.value?.trim();
    if (!task) return;
    console.log('Inserting task:', task);
    Meteor.call('tasks.insert', task);
    target.text.value = '';
  },
});
