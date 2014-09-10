/**
 *  Module
 *
 * Description
 */
angular.module('TODO', [, 'mongolabResourceHttp'])
    .constant('MONGOLAB_CONFIG', {
        API_KEY: '3yhw0fVhiNurNsxN3EYtqs0ogQBdC0ND',
        DB_NAME: 'chopper_mongo'
    })
    .factory('todoListFactory', function($mongolabResourceHttp) {
        return $mongolabResourceHttp('todoList');
    })
    .controller('todoCtl', ['$scope', 'todoListFactory',
        function($scope, todoListFactory) {

            todoListFactory.all().then(function(todoList) {
                $scope.todoTasks = todoList;
            });
            $scope.showAddTask = function() {
                $scope.showAdd = true;
            };
            $scope.hideAddTask = function() {
                $scope.showAdd = false;
                $scope.name = '';
                $scope.description = '';
                $scope.todoFrm.$setPristine();
            };
            $scope.deleteTask = function(task) {
                $scope.todoTasks.splice($scope.todoTasks.indexOf(task), 1);
                todoListFactory.query({
                    'name': task.name
                }).then(function(removeTask) {
                    removeTask[0].$remove(function() {
                        console.log('already remove.');
                    });

                });
            };
            $scope.addTask = function() {
                if ($scope.todoFrm.$valid) {
                    var newTask = {
                        'priority': 1,
                        'name': $scope.name,
                        'date': new Date(),
                        'description': $scope.description,
                        'done': false
                    }
                    $scope.todoTasks.push(newTask);
                    $scope.hideAddTask();
                    var addTaskDB = new todoListFactory(newTask);
                    addTaskDB.$save();
                } else {
                    $scope.todoFrm.$setDirty();
                };

            };
            $scope.checkTask = function(task) {
                $scope.todoTasks[$scope.todoTasks.indexOf(task)].done = !$scope.todoTasks[$scope.todoTasks.indexOf(task)].done;
                todoListFactory.query({
                    'name': task.name
                }).then(function(updateTask) {
                    updateTask[0].done = !updateTask[0].done;
                    updateTask[0].$update(function() {
                        console.log('already update.');
                    });

                });
            }
        }
    ]);
// .factory('Project', ['$resource',
//     function($resource) {
//         var Project = $resource('https://api.mongolab.com/api/1/databases/chopper_mongo/collections/todoList/:id', {
//             apiKey: '3yhw0fVhiNurNsxN3EYtqs0ogQBdC0ND',
//             id: '@_id.$oid'

//         }, {
//             update: {
//                 method: 'PUT'
//             },
//             remove: {
//                 method: 'DELETE'
//             }
//         });

//         Project.prototype.update = function(cb) {
//             return Project.update({
//                     id: this._id.$oid
//                 },
//                 angular.extend({}, this, {
//                     _id: undefined
//                 }), cb);
//         };

//         Project.prototype.destroy = function(cb) {
//             return Project.remove({
//                 id: this._id.$oid
//             }, cb);
//         };

//         return Project;
//     }
// ])
// .controller('todoCtl', ['$scope', 'Project', 'todoListFactory',

//     function($scope, Project, todoListFactory) {


//         todoListFactory.all().then(function(todoList) {
//             $scope.todoTasks = todoList;
//         });

//         // $scope.todoTasks = Project.query();
//         // $scope.showAddTask = function() {
//         //     $scope.showAdd = true;
//         // };
//         $scope.hideAddTask = function() {
//             $scope.showAdd = false;
//             $scope.name = '';
//             $scope.description = '';
//             $scope.todoFrm.$setPristine();
//         };
//         $scope.addTask = function() {
//             if ($scope.todoFrm.$valid) {
//                 var newTask = {
//                     'priority': 1,
//                     'name': $scope.name,
//                     'date': new Date(),
//                     'description': $scope.description
//                 }
//                 $scope.todoTasks.push(newTask);
//                 $scope.hideAddTask();
//                 var todoDB = new Project(newTask);
//                 todoDB.$save();
//             } else {
//                 $scope.todoFrm.$setDirty();
//             };

//         };
//         // $scope.editTask = function(task) {
//     $scope.project.$saveOrUpdate(changeSuccess, changeSuccess, changeError, changeError);
// }

// $scope.deleteTask = function(task) {
//     var params = {
//         id: task.id
//     };
//     Project.remove(params);
//     // Project.remove(Project.query({'name':'task1'}));
//     // Project.destroy(task);
//     // var todoDB = Project.get({
//     //     name: task.name
//     // });
//     // console.log('task.description' + task.description);

//     // todoDB.$delete();
// };
//     }
// ]);
