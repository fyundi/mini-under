

/**
 * Action 的数据结构
 */
export interface ActionSheetData {
    Title: string,       //标题
    List: Array<ActionSheetDataItem>
}

export interface ActionSheetDataItem {
    Id: number,         //id： 主要用来排序
    Desc: string,       //Desc: 显示的文本描述
    Action: Function    // 动作
}