import React from "react";
import get from "lodash.get";
import {DataTypes} from "~/modules/data-manager/data-types";

const AddView = ({source, views, user}) => {
    const newVersion = Math.max(...views.map(v => parseInt(v.version))) + 1;
    const sourceTypeToFileNameMapping = source.type.substring(0,3) === 'tl_' ? 'tiger_2017' : source.type;
    const CreateComp = React.useMemo(() =>
            get(DataTypes, `[${sourceTypeToFileNameMapping}].sourceCreate.component`, () => <div />)
        ,[DataTypes, source, views, user]);

    console.log('??', newVersion, source )
    return <CreateComp source={source} existingSource={source} user={user} newVersion={newVersion} />
};

export default AddView