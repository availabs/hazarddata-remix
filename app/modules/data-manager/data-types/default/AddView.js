import React from "react";
import get from "lodash.get";
import {DataTypes} from "~/modules/data-manager/data-types";

const AddView = ({source, views, user}) => {
    const newVersion = Math.max(...views.map(v => parseInt(v.version))) + 1;
    const CreateComp = React.useMemo(() =>
            get(DataTypes, `[${source.type}].sourceCreate.component`, () => <div />)
        ,[DataTypes, source.type]);

    return <CreateComp source={source} existingSource={source} user={user} newVersion={newVersion} />
};

export default AddView