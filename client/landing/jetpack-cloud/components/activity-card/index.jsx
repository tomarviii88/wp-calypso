/**
 * External dependencies
 */
import React, { Component } from 'react';
import { localize } from 'i18n-calypso';
import page from 'page';

/**
 * Internal dependencies
 */
import Gridicon from 'components/gridicon';
import Button from 'components/forms/form-button';
import { Card } from '@automattic/components';
import ActivityActor from 'my-sites/activity/activity-log-item/activity-actor';
import ActivityDescription from 'my-sites/activity/activity-log-item/activity-description';
import { applySiteOffset } from 'lib/site/timezone';
import PopoverMenu from 'components/popover/menu';

/**
 * Style dependencies
 */
import './style.scss';
import downloadIcon from './download-icon.svg';
import cloudIcon from './cloud-icon.svg';

class ActivityCard extends Component {
	constructor() {
		super();
		this.state = {
			showPopoverMenu: false,
		};
	}

	togglePopoverMenu = () => this.setState( { showPopoverMenu: ! this.state.showPopoverMenu } );
	closePopoverMenu = () => this.setState( { showPopoverMenu: false } );
	createRestoreUrl = restoreId => `/backups/${ this.props.siteSlug }/restore/${ restoreId }`;
	createDownloadUrl = downloadId => `/backups/${ this.props.siteSlug }/download/${ downloadId }`;
	createDetailUrl = backupId => `/backups/${ this.props.siteSlug }/detail/${ backupId }`;
	triggerRestore = () => page.redirect( this.createRestoreUrl( this.props.activity.rewindId ) );
	triggerDownload = () => page.redirect( this.createDownloadUrl( this.props.activity.rewindId ) );
	triggerDetails = () => page.redirect( this.createDetailUrl( this.props.activity.rewindId ) );

	render() {
		const { activity, allowRestore, gmtOffset, timezone, translate } = this.props;

		const backupTimeDisplay = applySiteOffset( activity.activityTs, {
			timezone,
			gmtOffset,
		} ).format( 'LT' );

		return (
			<div className="activity-card">
				<div className="activity-card__time">
					<img src={ cloudIcon } className="activity-card__time-icon" role="presentation" alt="" />
					<div className="activity-card__time-text">{ backupTimeDisplay }</div>
				</div>
				<Card>
					<ActivityActor
						{ ...{
							actorAvatarUrl: activity.actorAvatarUrl,
							actorName: activity.actorName,
							actorRole: activity.actorRole,
							actorType: activity.actorType,
						} }
					/>
					<div className="activity-card__activity-description">
						<ActivityDescription activity={ activity } rewindIsActive={ allowRestore } />
					</div>
					<div className="activity-card__activity-title">{ activity.activityTitle }</div>
					<div className="activity-card__activity-actions">
						<Button
							compact
							borderless
							className="activity-card__detail-button"
							onClick={ this.triggerDetails }
						>
							{ translate( 'See content' ) }
							<Gridicon icon="chevron-down" />
						</Button>
						<Button
							compact
							borderless
							className="activity-card__actions-button"
							onClick={ this.togglePopoverMenu }
							ref="popoverMenuButton"
						>
							{ translate( 'Actions' ) }
							<Gridicon icon="add" className="activity-card__actions-icon" />
						</Button>

						<PopoverMenu
							context={ this.refs && this.refs.popoverMenuButton }
							isVisible={ this.state.showPopoverMenu }
							onClose={ this.closePopoverMenu }
							className="activity-card__popover"
						>
							<Button onClick={ this.triggerRestore } className="activity-card__restore-button">
								{ translate( 'Restore to this point' ) }
							</Button>
							<Button
								borderless
								compact
								isPrimary={ false }
								onClick={ this.triggerDownload }
								className="activity-card__download-button"
							>
								<img
									src={ downloadIcon }
									className="activity-card__download-icon"
									role="presentation"
									alt=""
								/>
								{ translate( 'Download backup' ) }
							</Button>
						</PopoverMenu>
					</div>
				</Card>
			</div>
		);
	}
}

export default localize( ActivityCard );
