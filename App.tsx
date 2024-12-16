import React, { Component, ChangeEvent } from 'react';

interface Param {
  id: number;
  name: string;
  type: 'string';
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
  colors: string[];
}

interface Props {
  params: Param[];
  model: Model;
}

interface State {
  paramValues: ParamValue[];
}

class ParamEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      paramValues: props.model.paramValues,
    };
  }

  handleInputChange = (paramId: number, value: string) => {
    this.setState((prevState) => {
      const updatedParamValues = prevState.paramValues.map((paramValue) =>
        paramValue.paramId === paramId
          ? { ...paramValue, value }
          : paramValue
      );

      const existingIds = updatedParamValues.map((pv) => pv.paramId);
      const newParams = this.props.params
        .filter((param) => !existingIds.includes(param.id))
        .map((param) => ({ paramId: param.id, value: '' }));

      return { paramValues: [...updatedParamValues, ...newParams] };
    });
  };

  public getModel(): Model {
    return {
      paramValues: this.state.paramValues,
      colors: this.props.model.colors,
    };
  }

  render() {
    const { params } = this.props;
    const { paramValues } = this.state;

    return (
      <div>
        {params.map((param) => {
          const paramValue = paramValues.find((pv) => pv.paramId === param.id)?.value || '';
          return (
            <div key={param.id}>
              <label htmlFor={`param-${param.id}`}>{param.name}</label>
              <input
                id={`param-${param.id}`}
                type="text"
                value={paramValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  this.handleInputChange(param.id, e.target.value)
                }
              />
            </div>
          );
        })}
      </div>
    );
  }
}


const params: Param[] = [
  { id: 1, name: 'Назначение', type: 'string' },
  { id: 2, name: 'Длина', type: 'string' },
];

const model: Model = {
  paramValues: [
    { paramId: 1, value: 'повседневное' },
    { paramId: 2, value: 'макси' },
  ],
  colors: [],
};

const App = () => {
  const editorRef = React.createRef<ParamEditor>();

  const handleSave = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getModel());
    }
  };

  return (
    <div>
      <ParamEditor ref={editorRef} params={params} model={model} />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default App;
