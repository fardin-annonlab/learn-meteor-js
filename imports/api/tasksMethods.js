import { check } from 'meteor/check';
import { TasksCollection } from './TasksCollection';

Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);
    
    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    try {
      TasksCollection.insertAsync({
        text,
        createdAt: new Date(),
        userId: this.userId,
      });
    } catch (error) {
      throw new Meteor.Error('insert-failed', error.message);
    }
  },

  'tasks.remove'(taskId) {
    check(taskId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const task = TasksCollection.findOne(taskId);
    if (task.userId !== this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    TasksCollection.remove(taskId);
  },

  'tasks.setIsChecked'(taskId, isChecked) {
    check(taskId, String);
    check(isChecked, Boolean);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    const task = TasksCollection.findOne(taskId);
    if (task.userId !== this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    TasksCollection.update(taskId, {
      $set: {
        isChecked
      }
    });
  }
});