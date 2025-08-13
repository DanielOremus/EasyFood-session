import QueryParser from "./QueryParser.mjs"
import { Op } from "sequelize"

class SelectionHelper {
  static applyFilters(whereOptions, includeWhereOptions, filters) {
    for (const filterObj of filters) {
      switch (filterObj.filterType) {
        case "minValue":
          whereOptions[filterObj.fieldName] = {
            [Op.gte]: filterObj.filterValue,
          }
          break
        case "maxValue":
          whereOptions[filterObj.fieldName] = {
            [Op.lte]: filterObj.filterValue,
          }
          break
        case "in":
          if (filterObj.refModel) {
            includeWhereOptions.push({
              model: filterObj.refModel,
              where: {
                [filterObj.fieldName]: {
                  [Op.in]: filterObj.filterValue,
                },
              },
            })
          } else {
            whereOptions[filterObj.fieldName] = {
              [Op.in]: filterObj.filterValue,
            }
          }

          break
        case "search":
          whereOptions[filterObj.fieldName] = {
            [Op.like]: `%${filterObj.filterValue}%`,
          }
          break

        default:
          console.log(`Unsupported filterType: ${filterObj.filterType}`)
      }
    }
    return { whereOptions, includeWhereOptions }
  }
  static applyActions(options, actions) {
    actions.forEach((actionObj) => {
      switch (actionObj.type) {
        case "sort":
          options.order = [...options.order, [actionObj.field, actionObj.order]]
          break
        case "skip":
          options.offset = actionObj.value
          break
        case "limit":
          options.limit = actionObj.value
          break
        default:
          console.log(`Unsupported action type: ${actionObj.type}`)
          break
      }
    })
    return options
  }
  static applySelection(reqQuery, fieldsConfig) {
    const { actions, filters } = QueryParser.parse(reqQuery, fieldsConfig)

    let optionsObj = {}
    let filtersOpts
    if (filters.length) {
      filtersOpts = this.applyFilters(optionsObj, [], filters)
      optionsObj.where = filtersOpts.whereOptions
      optionsObj.include = filtersOpts.includeWhereOptions
    }
    if (actions.length) optionsObj = this.applyActions(optionsObj, actions)

    return optionsObj
  }
  static applyFiltersSelection(reqQuery, fieldsConfig, filterOptions = {}) {
    const filters = QueryParser.parseFilters(reqQuery, fieldsConfig)
    console.log("filters-----------------")

    console.log(filters)
    let result
    if (filters.length) result = this.applyFilters(filterOptions, [], filters)
    return { filterOptions: result.whereOptions, includeFilterOptions: result.includeWhereOptions }
  }
  static applyActionsSelection(reqQuery) {
    const actions = QueryParser.parseActions(reqQuery)
    console.log("actions-----------------")

    console.log(actions)

    let actionsOptions = {}

    if (actions.length) actionsOptions = this.applyActions(actionsOptions, actions)
    return actionsOptions
  }
}

export default SelectionHelper
