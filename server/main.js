import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/api/TasksCollection';
import { Accounts } from 'meteor/accounts-base';


const SEED_USERNAME = 'fardin';
const SEED_PASSWORD = '123456789';

// const insertTask = async taskText => {
//   await TasksCollection.insertAsync({ text: taskText });
// };

const insertTask = (taskText, user) =>
  TasksCollection.insert({
    text: taskText,
    userId: user._id,
    createdAt: new Date(),
  });

Meteor.startup(async () => {
  
  let user = Accounts.findUserByUsername(SEED_USERNAME);

  if (!user) {
    console.log(`Creating default user "${SEED_USERNAME}"...`);
    const userId = Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
    user = Meteor.users.findOne(userId);
  }

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
