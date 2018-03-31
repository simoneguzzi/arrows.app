import React, {Component} from 'react'
import {Form, Input, Segment, Icon, Header, Button} from 'semantic-ui-react'
import {connect} from "react-redux";
import {setProperties, setNodeCaption, setRelationshipType, renameProperties, removeProperty} from "../actions/graph";
import {commonValue} from "../model/values";
import {describeSelection, selectedNodes, selectedRelationships} from "../model/selection";
import {combineProperties} from "../model/properties";

class Inspector extends Component {
  constructor(props) {
    super(props)
    this.newPropElementKey = 1
  }

  state = {
    addProperty: {state: 'empty', key: '', value: ''}
  }

  render() {
    const {selection, graph, onSaveCaption, onSaveType, onSavePropertyValue} = this.props
    const fields = []

    const nodes = selectedNodes(graph, selection)
    const relationships = selectedRelationships(graph, selection)
    const properties = combineProperties([...nodes, ...relationships])

    if (nodes.length > 0 && relationships.length === 0) {
      const commonCaption = commonValue(nodes.map((node) => node.caption)) || ''
      fields.push(
        <Form.Field key='_caption'>
          <label>Caption</label>
          <Input value={commonCaption}
                 onChange={(event) => onSaveCaption(selection, event.target.value)}
                 placeholder='<multiple values>'/>
        </Form.Field>
      )
    }

    if (relationships.length > 0 && nodes.length === 0) {
      const commonType = commonValue(relationships.map((relationship) => relationship.type))
      fields.push(
        <Form.Field key='_type'>
          <label>Type</label>
          <Input value={commonType || ''}
                 onChange={(event) => onSaveType(selection, event.target.value)}
                 placeholder={commonType === undefined ? '<multiple types>' : null}/>
        </Form.Field>
      )
    }

    if (nodes.length > 0 || relationships.length > 0) {
      fields.push(this.propertyTable(properties))
      fields.push((
        <Button onClick={(event) => onSavePropertyValue(selection, '', '')}>+ Property</Button>
      ))
    }

    return (
      <Segment inverted>
        <Header as='h2'>
          <Icon name='edit'/>
          Inspector
        </Header>
        <p>
          {describeSelection(selection)}
        </p>
        <Form inverted style={{'textAlign': 'left'}}>
          {fields}
        </Form>
      </Segment>
    )
  }

  propertyInput(property) {
    switch (property.status) {
      case 'CONSISTENT':
        return {valueFieldValue: property.value, valueFieldPlaceHolder: null}

      case 'INCONSISTENT':
        return {valueFieldValue: '', valueFieldPlaceHolder: '<multiple values>'}

      default:
        return {valueFieldValue: '', valueFieldPlaceHolder: '<partially present>'}
    }
  }

  propertyTable(properties) {
    const rows = Object.keys(properties).map((key) => {
      const onKeyChange = (event) => this.props.onSavePropertyKey(this.props.selection, key, event.target.value);
      const onValueChange = (event) => this.props.onSavePropertyValue(this.props.selection, key, event.target.value)
      const onDeleteProperty = (event) => this.props.onDeleteProperty(this.props.selection, key)
      const {valueFieldValue, valueFieldPlaceHolder} = this.propertyInput(properties[key])
      return (
        <Form.Group widths='equal'>
          <Form.Input fluid value={key} onChange={onKeyChange}/>
          <Form.Input fluid value={valueFieldValue} placeholder={valueFieldPlaceHolder} onChange={onValueChange}
                      action={{icon: 'close', onClick: onDeleteProperty}}/>
        </Form.Group>
      )
    })
    return (
      <div>
        <Form.Field>
          <label>Properties</label>
        </Form.Field>
        {rows}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    graph: state.graph,
    selection: state.gestures.selection
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSaveCaption: (selection, caption) => {
      dispatch(setNodeCaption(selection, caption))
    },
    onSaveType: (selection, type) => {
      dispatch(setRelationshipType(selection, type))
    },
    onSavePropertyKey: (selection, oldPropertyKey, newPropertyKey) => {
      dispatch(renameProperties(selection, oldPropertyKey, newPropertyKey))
    },
    onSavePropertyValue: (selection, key, value) => {
      dispatch(setProperties(selection, [{key, value}]))
    },
    onDeleteProperty: (selection, key) => {
      dispatch(removeProperty(selection, key))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Inspector)
