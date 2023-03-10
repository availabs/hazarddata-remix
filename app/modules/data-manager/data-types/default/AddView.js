import React, {useState} from "react";
import get from "lodash.get";
import {DataTypes} from "~/modules/data-manager/data-types";

const AddView = ({source, views, user}) => {
    const newVersion = Math.max(...views.map(v => parseInt(v.version) || 0)) + 1;
    const [versionName, setVersionName] = useState(newVersion);
    const sourceTypeToFileNameMapping = source.type.substring(0,3) === 'tl_' ? 'tiger_2017' : source.type;
    const CreateComp = React.useMemo(() =>
            get(DataTypes, `[${sourceTypeToFileNameMapping}].sourceCreate.component`, () => <div />)
        ,[DataTypes, source, views, user]);

    console.log('??', newVersion, source );
    return <>
        <div className={`flex-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 text-sm font-medium text-gray-500 `}>
            <label>Version Name:</label>
            <input
                key={'versionName'}
                className={'p-2'}
                placeholder={versionName}
                onChange={e => setVersionName(e.target.value)}/>
        </div>
        <CreateComp source={source} existingSource={source} user={user} newVersion={versionName} />
    </>
};

export default AddView