const getSelect = (connection,callback)=>{
    const selectQuery = "SELECT * FROM month_temperature_weather";

    connection.query(selectQuery, (err,result)=>{
        if(err){
            console.error("데이터 조회 실패:",err);
            return;
        }

        console.log("조회 데이터:");
        console.table(result);
        console.log(result);
        callback();
    });
};

export default getSelect;