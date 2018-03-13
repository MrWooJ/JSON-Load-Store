var app = require('../../server/server')

module.exports = function(controller) {

  controller.createModel = function (model, apiKey, cb) {
		var date = Math.floor((new Date).getTime())
		var config = app.models.config
		if(!model)
			return cb(new Error('Empty Model'))
		if(!apiKey)
			return cb(new Error('Empty ApiKey'))
		if(!model.name)
			return cb(new Error('Empty name'))
		if(!model.data)
			return cb(new Error('Empty data'))
		var configModel = {
			apiKey: apiKey,
			name: model.name,
			data: model.data,
			changeSequence: []
		}
		configModel.changeSequence.push(date)
		config.find({'where':{'apiKey': apiKey}}, function(err, configList) {
			if (err)
				return cb(err)
			for (var i = 0; i < configList.length; i++)
				if (configList[i].name === model.name)
					return cb(new Error('duplicate name in model for this user'))
			config.create(configModel, function(err, newConfigModel) {
				if (err)
					return cb(err)
				return cb(null, newConfigModel)
			})
		})
  }

  controller.remoteMethod('createModel', {
    accepts: [{
			arg: 'model',
			type: 'object',
			required: true,
      http: {
        source: 'body'
      }
    }, {
      arg: 'apiKey',
			type: 'string',
			required: true,
      http: {
        source: 'query'
      }
    }],
    description: 'create a json config model for this particular user',
    http: {
      path: '/create/model',
      verb: 'POST',
      status: 200,
      errorStatus: 400
    },
    returns: {
      root: true,
      type: 'object'
    }
  })

  controller.retriveModel = function (name, apiKey, cb) {
		var config = app.models.config
		if(!name)
			return cb(new Error('Empty Name'))
		if(!apiKey)
			return cb(new Error('Empty ApiKey'))
		config.find({'where':{'apiKey': apiKey}}, function(err, configList) {
			if (err)
				return cb(err)
			if (configList.length == 0)
				return cb(new Error('No Model for Retrive'))
			if (configList.length >= 2)
				return cb(new Error('Duplicate Model for Retrive'))
			var retrivedModel = {}
			var check = false
			for (var i = 0; i < configList.length; i++) {
				if (configList[i].name === name) {
					check = true
					retrivedModel = configList[i]
				}
			}
			if (check == true)
				return cb(null, retrivedModel)
			else 
				return cb(new Error('No Model with this Name for Retrive'))
		})
  }

  controller.remoteMethod('retriveModel', {
    accepts: [{
      arg: 'name',
			type: 'string',
			required: true,
      http: {
        source: 'path'
      }
    }, {
      arg: 'apiKey',
			type: 'string',
			required: true,
      http: {
        source: 'query'
      }
    }],
    description: 'retrive a json particular config model for this particular user',
    http: {
      path: '/retrive/model/:name',
      verb: 'POST',
      status: 200,
      errorStatus: 400
    },
    returns: {
      root: true,
      type: 'object'
    }
  })

  controller.updateModel = function (name, model, apiKey, cb) {
		var date = Math.floor((new Date).getTime())
		var config = app.models.config
		if(!name)
			return cb(new Error('Empty Name'))
		if(!apiKey)
			return cb(new Error('Empty ApiKey'))
		config.find({'where':{'apiKey': apiKey}}, function(err, configList) {
			if (err)
				return cb(err)
			if (configList.length == 0)
				return cb(new Error('No Model for Update'))
			if (configList.length >= 2)
				return cb(new Error('Duplicate Model for Update'))
			var retrivedModel = {}
			var check = false
			for (var i = 0; i < configList.length; i++) {
				if (configList[i].name === name) {
					check = true
					retrivedModel = configList[i]
				}
			}
			if (check == true) {
				var particularModel = configList[0]
				var newModel = JSON.parse(JSON.stringify(configList[0]))
				if (model.name) {
					if (model.name !== particularModel.name) {
						for (var i = 0; i < configList.length; i++)
							if (configList[i].name === model.name)
								return cb(new Error('duplicate name in model for this user'))
						newModel.name = model.name
					}
				}
				if (model.data)
					newModel.data = model.data
				newModel.changeSequence.push(date)
				particularModel.updateAttributes(newModel, function(err, updatedConfigModel) {
					if (err)
						return cb(err)
					return cb(null, updatedConfigModel)
				})	
			}
			else 
				return cb(new Error('No Model with this Name for Retrive'))
		})
  }

  controller.remoteMethod('updateModel', {
    accepts: [{
      arg: 'name',
			type: 'string',
			required: true,
      http: {
        source: 'path'
      }
    }, {
			arg: 'model',
			type: 'object',
			required: true,
      http: {
        source: 'body'
      }
    }, {
      arg: 'apiKey',
			type: 'string',
			required: true,
      http: {
        source: 'query'
      }
    }],
    description: 'update a json particular config model for this particular user (send the whole model)',
    http: {
      path: '/update/model/:name',
      verb: 'POST',
      status: 200,
      errorStatus: 400
    },
    returns: {
      root: true,
      type: 'object'
    }
  })

  controller.removeModel = function (name, apiKey, cb) {
		var config = app.models.config
		if(!name)
			return cb(new Error('Empty Name'))
		if(!apiKey)
			return cb(new Error('Empty ApiKey'))
		config.find({'where':{'apiKey': apiKey}}, function(err, configList) {
			if (err)
				return cb(err)
			if (configList.length == 0)
				return cb(new Error('No Model for Delete'))
			if (configList.length >= 2)
				return cb(new Error('Duplicate Model for Delete'))
			var retrivedModel = {}
			var check = false
			for (var i = 0; i < configList.length; i++) {
				if (configList[i].name === name) {
					check = true
					retrivedModel = configList[i]
				}
			}
			if (check == true) {
				var particularModel = configList[0]
				config.destroyById(particularModel.id, function(err) {
					if (err)
						return cb(err)
					return cb(null, 'successfull removal')
				})	
			}
			else 
				return cb(new Error('No Model with this Name for Retrive'))
		})
  }

  controller.remoteMethod('removeModel', {
    accepts: [{
      arg: 'name',
			type: 'string',
			required: true,
      http: {
        source: 'path'
      }
    }, {
      arg: 'apiKey',
			type: 'string',
			required: true,
      http: {
        source: 'query'
      }
    }],
    description: 'remove a json particular config model for this particular user',
    http: {
      path: '/remove/model/:name',
      verb: 'POST',
      status: 200,
      errorStatus: 400
    },
    returns: {
      root: true,
      type: 'object'
    }
  })

}
