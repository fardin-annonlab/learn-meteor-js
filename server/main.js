import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/api/TasksCollection';

const insertTask = async taskText => {
  await TasksCollection.insertAsync({ text: taskText });
};

Meteor.startup(async () => {
  const count = await TasksCollection.find().countAsync();
  if (count === 0) {
    const tasks = [
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task'
    ];

    for (const task of tasks) {
      await insertTask(task);
    }
  }
});
