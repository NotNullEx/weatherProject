const getSelect = (connection,callback)=>{
    const selectQuery = "SELECT * FROM month_temperature_weather";

    connection.query(selectQuery, (err,result)=>{
        if(err){
            return;
        }
        callback();
    });
};

export default getSelect;