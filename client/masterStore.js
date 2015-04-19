var eventBus = require("./eventBus.js");
var _ = require("lodash");

function MasterStore() {

  var initialMagicData = {
      args: null,
      suggestions: [],
      argsSuggestions: [],
      suggestionArgsActive: -1,
      suggestionActive: 0,
      preArgsLength: 0
  };

  var state = {
              activeView: undefined, 
              magicData: _.cloneDeep(initialMagicData)
            }
  
  var updateMethods = {
    //VIEW METHODS
    openView: function(newViewComponent) {
      state.activeView = newViewComponent;
    },
    //MAGIC METHODS
    resetState: function(rend){
      state.magicData = _.cloneDeep(initialMagicData);
    },
    setActiveSuggestion: function(sug){
      state.magicData.suggestionActive = sug;
    },
    setActiveArgsSuggestion: function(sug){
      state.magicData.suggestionArgsActive = sug;
    },
    setSuggestions: function(suggestions){
      state.magicData.suggestions = suggestions;
    },
    setArgsSuggestions: function(suggestions){
      state.magicData.argsSuggestions = suggestions;
    },
    setArguments: function(args){
      state.magicData.args = args;
    },
    activeSuggestionUp: function(){
      if(state.argsSuggestions){
        var active = (state.magicData.suggestionArgsActive - 1);
        if(active < -1){
          active = state.magicData.argsSuggestions.length-1;
        }
        methods.setActiveArgsSuggestion(active);
      }else{
        var active = (state.magicData.suggestionActive - 1);
        if(active < 0){
          active = state.magicData.suggestions.length-1;
        }
        methods.setActiveSuggestion(active);
      }
    },
    activeSuggestionDown: function(){
      if(state.argsSuggestions){
        var active = (state.magicData.suggestionArgsActive + 1) % state.magicData.argsSuggestions.length;
        methods.setActiveArgsSuggestion(active);
      }else{
        var active = (state.magicData.suggestionActive + 1) % state.magicData.suggestions.length;
        methods.setActiveSuggestion(active);
      }
    }, 
  };

  var nonUpdateMethods = {
    getState: function() {
      return state;
    }
  }

  var methods = nonUpdateMethods;

  //Cause all of the update methods to update the view.
  //Maybe for performance don't bake this in. could just have an update method outside of the store.
  _.each(updateMethods, function(func, name) {
    methods[name] = function() {
      func.apply(null,arguments);
      eventBus.emit("master");
    }
  });

  return methods;
}
  

module.exports = MasterStore();