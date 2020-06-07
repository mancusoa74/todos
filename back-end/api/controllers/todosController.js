const Todos = require("../models/todosModel");

exports.getAllTasks = async (req, res) => {
  console.log("getAllTasks");
  let tasks = [];
  try {
    await Todos.findAll().then(todos => {
      if(todos) {
        todos.forEach(function(v,i,a){tasks.push(v.dataValues)});
      }
      else
        console.log("Task Not Found");
    });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getTask = async (req, res) => {
    const id = req.params.taskId;
    await Todos.findByPk(id).then(task => {
      if(task) {
        res.status(200).json(task);
      }
      else {
        console.log("Task Not Found");
        res.status(404).json({data: 'id not found'});
      }
    }).  
    catch (err => {
      res.status(500).json(err);
  })
};

exports.addTask = async (req, res) => {
  try {
    let newTask = await Todos.create(req.body);
    console.log(newTask);
    res.status(200).json({ data: newTask });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.updateTask = async (req, res) => {
    const _id = req.params.taskId;
    console.log("ID: ",_id);

    await Todos.update(req.body, {where: {id: _id}}).
    then(nrow => {console.log("updated ", nrow[0], "rows"); res.status(200).json(_id)}).
    catch(err => {console.log(err);res.status(500).json(err);});


};

exports.deleteTask = async (req, res) => {
  const _id = req.params.taskId;
  console.log("ID: ",_id);  
  await Todos.destroy({where: { id: _id }}).
  then(nrow => {console.log("delete ", nrow[0], "rows"); res.status(200).json(_id)}).
  catch(err => {console.log(err); res.status(500).json(err);});
};