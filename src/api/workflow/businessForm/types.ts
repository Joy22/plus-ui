export interface BusinessFormVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 申请编码
   */
  applyCode: string;

  /**
   * 表单id
   */
  formId: string | number;

  /**
   * 表单名称
   */
  formName: string;
  wfFormDefinitionVo: {
      /**
       * 主键
       */
      id: string | number;

      /**
       * 动态表单id
       */
      formId: string | number;

      /**
       * 流程定义id
       */
      processDefinitionKey: string;

      /**
       * 流程定义名称
       */
      processDefinitionName: string;

      /**
       * 流程定义id
       */
      processDefinitionId: string | number;

      /**
       * 流程定义版本
       */
      processDefinitionVersion: number;
  };

}

export interface BusinessFormForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 申请编码
   */
  applyCode?: string;

  /**
   * 表单id
   */
  formId?: string | number;

  /**
   * 表单名称
   */
  formName?: string;

  /**
   * 表单内容
   */
  content?: string;

  /**
   * 表单值
   */
  contentValue?: string;

}

export interface BusinessFormQuery extends PageQuery {

  /**
   * 申请编码
   */
  applyCode?: string;

  /**
   * 表单名称
   */
  formName?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



